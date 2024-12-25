// เมื่อฟอร์มล็อกอินถูกส่ง
document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // ป้องกันการส่งฟอร์มแบบปกติ

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/login.ejs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert('Login successful!');
            console.log(result); // แสดงข้อมูลที่ส่งกลับจาก API
            // คุณสามารถจัดการการเก็บ session หรือการนำทางหลังจากการเข้าสู่ระบบที่สำเร็จ
        } else {
            alert(result.error || 'Login failed!');
        }
    } catch (err) {
        console.error('Error:', err);
        alert('An error occurred. Please try again.');
    }
});
