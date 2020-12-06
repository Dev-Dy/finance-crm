function form_submit() {
    var username = document.getElementById('inputEmail').value;
    var password = document.getElementById('inputPassword').value;
    var body = { username, password };
    var url = '/api/advisor/login';
    axios.post(url, body)
        .then(res => {
            if (res.data.status == "success") {
                var JWT = "Bearer " + res.data.token;
                localStorage.setItem("token", JWT);
                location.href = '/advisor/dashboard/myprofile'
            }
            else {
                console.log('Fail');
            }
        })
        .catch(err => console.log('err', err)
        )
}