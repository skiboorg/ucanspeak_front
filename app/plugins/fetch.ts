import { createAuthRepository } from "~/repository/auth";
import { createLessonsRepository } from "~/repository/lessons";
import { createTrainerRepository } from "~/repository/trainer";

export default defineNuxtPlugin({
  name: 'fetch',
  parallel: true,
  async setup(nuxtApp){
    const config = useRuntimeConfig();

    const appFetch = $fetch.create({
      baseURL: config.public.apiUrl as string,
      retry: false,
      onRequest({ options }) {
        options.headers.append('Accept', 'application/json');

        const auth_token = useCookie('auth_token')

        if(auth_token.value){
          options.headers.append('Authorization', `Token ${auth_token.value}`);
        }
       
      },
      async onResponseError({ response }) {

        if(response.status == 401){
          nuxtApp.runWithContext(() => navigateTo('/'));
          // mb with real page reload
        }
      }
    });

    const api = {
      auth: createAuthRepository(appFetch),
      lessons: createLessonsRepository(appFetch),
      trainer: createTrainerRepository(appFetch),
    };
    
    return {
      provide: {
        appFetch,
        api
      }
    }
  }
});