import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { SignInInput, SignUpInput } from '../schema/auth.schema';
import { User } from '../schema/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpData: SignUpInput) {
    const existingUser = await this.userModel
      .findOne({ email: signUpData.email })
      .exec();

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(signUpData.password, 10);

    const user = new this.userModel({
      ...signUpData,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    const token = this.jwtService.sign({
      userId: String(savedUser._id),
      email: savedUser.email,
    });

    return {
      user: this.mapUserToResponse(savedUser),
      token,
    };
  }

  async signIn(signInData: SignInInput) {
    const user = await this.userModel
      .findOne({ email: signInData.email })
      .exec();

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      signInData.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      userId: String(user._id),
      email: user.email,
    });

    return {
      user: this.mapUserToResponse(user),
      token,
    };
  }

  async validateUser(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.mapUserToResponse(user);
  }

  private mapUserToResponse(user: User) {
    return {
      id: String(user._id),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
    };
  }
}
