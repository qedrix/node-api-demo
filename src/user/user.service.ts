import {PrismaClient, User, prisma} from '@prisma/client';
import bcrypt from 'bcrypt';
import UserDTO from '../dto/user.dto';
import {makeid} from '../common/helper';
import log from '../common/logger';

class UserService {

    static prisma = new PrismaClient();

    createUser = async (input: UserDTO) =>  {

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hashSync(input.password, salt)

        return await UserService.prisma.user.create({
            data: {
                email: input.email,
                password: hash,
                firstName: input.firstName, 
                lastName: input.lastName,
                dob: input.dob,
                active: false,
            }
        });
    }

    findByEmail = async (email: string) => {
        return await UserService.prisma.user.findUnique({
            where: {
                email: email,
            }
        });
    }

    findByID = async (id: number) => {
        log.info("Fetching by id from user service");
        const user = await UserService.prisma.user.findUnique({
            where: {
                id: id,
            },
            include: { preferences: true },
        });
        log.info("found user in service");
        return user;
    }

    updatePassword = async (email: string, password: string, resetKey: string) : Promise<Boolean> => {
        
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hashSync(password, salt)
        
        const updatedUser = await UserService.prisma.user.update({
            where: {
                email: email,
            },
            data: {
                password: hash
            }
        });
        
        if(updatedUser){
            return true;
        } else {
            return false;
        }
    }

    updatePreferences = async (email: string, preferences: Array<string>) => {
        
        const disconnectOldPreferences = UserService.prisma.user.update({
            where: {
                email: email,
            },
            data: {
                preferences: {
                    set: []
                }
            }
        });

        const connectNewPreferences =  UserService.prisma.user.update({
            where: {email: email},
            data: {
                preferences: {
                    // connect or create the new preferences
                    connectOrCreate: preferences.map((pref) => {
                        return {
                            where: { name: pref },
                            create: { name: pref },
                        };
                    }),
                }
            }
        });
        
        // run it in a transaction
        await UserService.prisma.$transaction([
            disconnectOldPreferences, connectNewPreferences ]);
    }

    addPasswordResetRequest = async (email: string) => {
        log.info("Create a new reset password request");
        const resetKey = makeid(32);
        const pr = await UserService.prisma.passwordRequest.create({
            data: {
                resetKey: resetKey,
                email: email
            }
        });
        
        return pr;
    }

    getPasswordRequest = async (email: string) => {
        return await UserService.prisma.passwordRequest.findFirst({
            where: {
                email: email,
            },
            orderBy: {
                createdAt: 'desc',
            }
        });
    }

    activateUserAccount = async (email: string) => {
        return await UserService.prisma.user.update({
            where: {
                email: email,
            },
            data:{
                active: true,
            }
        });
    }

    deleteUserByEmail = async (email: string) => {
        const deleteUser = await UserService.prisma.user.delete({
            where: {
              email: email,
            },
          })
        return deleteUser;
    }

}

export default UserService;