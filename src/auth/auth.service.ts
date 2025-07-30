import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon2 from 'argon2'; 
import { error } from "console";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService,private jwt:JwtService,private config:ConfigService) {}

  async signup(dto:AuthDto) {
    // hash the password
    const hash = await argon2.hash(dto.password); 

    try{ 
    // save new user to db
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash,
      },
    });

    return this.signToken(user.id, user.email);
    }catch(error){
        if(error instanceof PrismaClientKnownRequestError){
            if(error.code === 'P2002'){
                throw new ForbiddenException(
                    'Credentials taken',
                );
            }
        }
        throw error;
    }

  }

    async signin(dto: AuthDto) {
    // Find user by email
    const user = await this.prisma.user.findUnique({
        where: {
        email: dto.email,
        },
    });

    // If user does not exist
    if (!user) {
        throw new ForbiddenException('Email not matching');
    }

    // Compare the password
    const pwMatch = await argon2.verify(user.hash, dto.password);

    if (!pwMatch) {
        throw new ForbiddenException(' Incorrect Password');
    }
   
    return this.signToken(user.id, user.email);
    }

  async signToken(
    userId: number,
    email: string
   ): Promise<{access_token:string}>{
    const payload = {
        sub:userId,
        email
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
        expiresIn:'15m',
        secret:secret
    });
    return {
        access_token:token
    }
   }
}

   