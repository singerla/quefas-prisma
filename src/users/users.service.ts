import { PrismaService } from 'nestjs-prisma';
import { Injectable, BadRequestException } from '@nestjs/common';
import { PasswordService } from '../auth/password.service';
import { ChangePasswordInput } from './dto/change-password.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Quefas } from '../common/quefas';

@Injectable()
export class UsersService {
  que: Quefas;

  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService
  ) {
    this.que = new Quefas(this.prisma);
  }

  async updateUser(userId: string, newUserData: UpdateUserInput) {
    const user = await this.que.getElementById(userId);
    await user
      .setParam('firstname', newUserData.firstname)
      .setParam('lastname', newUserData.lastname)
      .update();

    return user;
  }

  async changePassword(
    userId: string,
    userPassword: string,
    changePassword: ChangePasswordInput
  ) {
    const passwordValid = await this.passwordService.validatePassword(
      changePassword.oldPassword,
      userPassword
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    const hashedPassword = await this.passwordService.hashPassword(
      changePassword.newPassword
    );

    const user = await this.que.getElementById(userId);
    await user.setParam('password', hashedPassword).update();

    return user;
  }
}
