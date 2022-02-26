import { reactive } from "vue";
let applicationState = reactive({ applications: [] });

export { applicationState }
export const getApplicationByMedia = (tp) => {
    let result = []
    for (let item of applicationState.applications) {
        if (item.handlerMediaTypes.findIndex((e) => e == tp) != -1) {
            result.push(item)
        }
    }
    return result;
}