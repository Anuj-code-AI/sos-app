function getLocation(callback) {
    if (!navigator.geolocation) {
        alert("Location not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        pos => callback(pos.coords.latitude, pos.coords.longitude),
        () => alert("Location permission denied")
    );
}
