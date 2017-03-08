export default new class DevMode {
    get isActive() {
        return STAGE == "DEVELOPMENT" && window.location.search.includes("devmode")
    }
}
