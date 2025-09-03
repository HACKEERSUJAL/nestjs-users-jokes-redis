import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { catchError, successResponse } from 'src/utils/response.util';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const data = await this.userService.createUser(createUserDto);
      return successResponse('User created successfully', data);
    } catch (error) {
      return catchError(error);
    }
  }

  @Get()
  async findAll() {
    try {
      const data = await this.userService.getAllUsers();
      return successResponse('Users fetched successfully', data);
    } catch (error) {
      return catchError(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.userService.getUser(id);
      if (!data) throw new Error('User not found');
      return successResponse('User fetched successfully', data);
    } catch (error) {
      return catchError(error);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const data = await this.userService.updateUser(id, updateUserDto);
      if (!data) throw new Error('User not found');
      return successResponse('User updated successfully', data);
    } catch (error) {
      return catchError(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const data = await this.userService.deleteUser(id);
      if (!data) throw new Error('User not found');
      return successResponse('User deleted successfully', data);
    } catch (error) {
      return catchError(error);
    }
  }
}
