import type { createAuthRepository } from '~/repository/auth'
import type { createLessonsRepository } from "~/repository/lessons";
import type { createTrainerRepository } from "~/repository/trainer";

export type AuthRepository = ReturnType<typeof createAuthRepository>
export type LessonsRepository = ReturnType<typeof createLessonsRepository>
export type TrainerRepository = ReturnType<typeof createTrainerRepository>


export interface IApi {
    auth: AuthRepository
    lessons: LessonsRepository
    trainer: TrainerRepository
}