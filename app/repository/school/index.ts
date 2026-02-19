export function createSchoolRepository(appFetch: typeof $fetch) {
    return {
        // Получить всех учеников школы
        list() {
            return appFetch(`/api/user/school-pupils/`)
        },

        // Получить конкретного ученика
        retrieve(id: string) {
            return appFetch(`/api/user/school-pupils/${id}/`)
        },

        // Создать нового ученика
        create(body: object) {
            return appFetch(`/api/user/school-pupils/`, {
                method: 'POST',
                body
            })
        },

        // Редактировать ученика (частичное обновление)
        update(id: string, body: object) {
            return appFetch(`/api/user/school-pupils/${id}/`, {
                method: 'PATCH',
                body
            })
        },

        // Удалить ученика из школы
        destroy(id: string) {
            return appFetch(`/api/user/school-pupils/${id}/`, {
                method: 'DELETE'
            })
        },
    }
}