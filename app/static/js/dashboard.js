const userId = localStorage.getItem("user_id");

const socket = io({
    query: {
        user_id: userId
    }
});

socket.on("new_alert", (data) => {
    alert(data.message);
});
