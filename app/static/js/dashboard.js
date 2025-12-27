let lastAlertTime = null;

function checkAlerts() {
    fetch("/api/alerts")
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) return;

            const latest = data[0];

            if (!lastAlertTime || latest.created_at !== lastAlertTime) {
                lastAlertTime = latest.created_at;
                alert(latest.message);
            }
        });
}

setInterval(checkAlerts, 5000); // every 5 seconds
