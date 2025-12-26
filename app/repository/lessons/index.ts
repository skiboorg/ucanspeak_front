
export function createLessonsRepository(appFetch: typeof $fetch){

    return {
        dictionary_favorites(){
            return appFetch('/api/lesson/dictionary_favorites/')
        },
        lesson_item_favorites(){
            return appFetch('/api/lesson/lesson_item_favorites/')
        },
        courses(){
            return appFetch('/api/lesson/courses/')
        },
        course(slug: string){
            return appFetch(`/api/lesson/courses/${slug}`)
        },
        level(slug: string){
            return appFetch(`/api/lesson/levels/${slug}`)
        },
        lesson(slug: string){
            return appFetch(`/api/lesson/lessons/${slug}`)
        }
        ,
        module(id: string){
            return appFetch(`/api/lesson/modules/${id}`)
        },
        toggle_block(body){
            return appFetch(`/api/lesson/modules/toggle_block/`,{
                method:'POST',
                body
            })
        },
        toggle_dictionary_favorite(body){
            return appFetch(`/api/lesson/dictionary-items/${body.id}/toggle_favorite/`,{
                method:'POST',
                body
            })
        },
        toggle_phrase_favorite(body){
            return appFetch(`/api/lesson/modules/toggle_favorite/`,{
                method:'POST',
                body
            })
        },

    }

}
