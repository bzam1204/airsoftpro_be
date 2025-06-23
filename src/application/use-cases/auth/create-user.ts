import {inject, injectable} from 'tsyringe';

import UserRepository from '@/domain/repositories/user-repository';
import HashingService from '@/application/services/hashing-service';
import IdGenerator from '@/application/services/id-generator';

import User from '@/domain/entities/user';

import {HASHING_SERVICE, ID_GENERATOR, USER_REPOSITORY} from '@/shared/constants/constants';

@injectable()
export default class CreateUser {
    //TODO: REFACTOR IT, MOVE IT TO THE SERVICE.
    private readonly _saltRounds = Number(process.env.HASHING_SALT_ROUNDS) ?? 10;

    constructor(
        @inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
        @inject(HASHING_SERVICE) private readonly hashingService: HashingService,
        @inject(ID_GENERATOR) private readonly idGenerator: IdGenerator,
    ) {
    };

    async execute(input: Input): Promise<Output> {
        if (await this.userAlreadyExists(input.email)) throw new Error('USER_ALREADY_EXISTS');
        const id = this.idGenerator.generate();
        const password = await this.hashingService.hash(input.password, this._saltRounds);
        const user = new User({...input, id, password});
        return this.userRepository.create(user);
    };

    private async userAlreadyExists(email: string) {
        return !!await this.userRepository.findByEmail(email);
    };

};

interface Input {
    password: string;
    fullName: string;
    birth: Date;
    photo: string;
    email: string;
}

type Output = User