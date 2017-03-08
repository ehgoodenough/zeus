export default new class Stash {
    set(name, data) {
        window.localStorage.setItem(name, JSON.stringify(data, null, 4))
    }
    get(name) {
        var data = window.localStorage.getItem(name)
        return !!data ? JSON.parse(data) : null
    }
    drop(name) {
        window.localStorage.removeItem(name)
    }
    download(name) {
        var data = window.localStorage.getItem(name)
        var blob = new Blob([data], {type: "application/json"})
        var url = window.URL.createObjectURL(blob)

        var element = document.createElement("a")
        element.setAttribute("download", name + ".json")
        element.setAttribute("href", url)
        element.click()

        window.URL.revokeObjectURL(url)
    }
}
