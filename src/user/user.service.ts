import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RedisService } from 'src/common/redis/redis.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly redisService: RedisService,
  ) { }

  private getCacheKey(id: string) {
    return `user:${id}`;
  }

  /** ---------------- CREATE USER ---------------- **/
  async createUser(dto: CreateUserDto) {
    try {
      const user = new this.userModel(dto);
      const savedUser = await user.save();

      // Convert ObjectId to string for Redis key
      const userId = (savedUser._id as Types.ObjectId).toHexString();

      // Cache in Redis
      await this.redisService.set(this.getCacheKey(userId), savedUser, 10);

      return savedUser;
    } catch (error) {
      this.logger.error('Failed to create user', error);
      throw new Error(error.message);
    }
  }

  /** ---------------- GET USER ---------------- **/
  async getUser(id: string) {
    const key = this.getCacheKey(id);
    try {
      // Check Redis cache
      const cached = await this.redisService.get<User>(key);
      if (cached) {
        this.logger.log('Returning user from cache');
        return cached;
      }

      // Fetch from MongoDB
      const user = await this.userModel.findById(id).lean();
      if (!user) throw new Error('User not found');

      // Cache in Redis
      await this.redisService.set(key, user, 10);

      return user;
    } catch (error) {
      this.logger.error(`Failed to fetch user ${id}`, error);
      throw new Error(error.message);
    }
  }

  /** ---------------- UPDATE USER ---------------- **/
  async updateUser(id: string, dto: UpdateUserDto) {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, dto, { new: true })
        .lean();

      if (!updatedUser) throw new Error('User not found');

      // Update cache
      await this.redisService.set(this.getCacheKey(id), updatedUser, 3600);
      console.log(updatedUser, 'updated user');
      return updatedUser;
    } catch (error) {
      this.logger.error(`Failed to update user ${id}`, error);
      throw new Error(error.message);
    }
  }

  /** ---------------- DELETE USER ---------------- **/
  async deleteUser(id: string) {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id).lean();
      if (!deletedUser) throw new Error('User not found');

      // Remove from Redis cache
      await this.redisService.del(this.getCacheKey(id));

      return deletedUser;
    } catch (error) {
      this.logger.error(`Failed to delete user ${id}`, error);
      throw new Error(error.message);
    }
  }

  /** ---------------- GET ALL USERS ---------------- **/
  async getAllUsers() {
    const key = 'users:all';
    try {
      // Check cache
      const cached = await this.redisService.get<User[]>(key);
      if (cached) {
        this.logger.log('Returning all users from cache');
        return cached;
      }

      // Fetch from MongoDB
      const users = await this.userModel.find().lean();

      // Cache in Redis
      await this.redisService.set(key, users, 10);
      console.log("users", users);
      return users;
    } catch (error) {
      this.logger.error('Failed to fetch all users', error);
      throw new Error(error.message);
    }
  }
}
