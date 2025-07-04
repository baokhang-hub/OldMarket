// Example: Toggle profile/logout links if user is signed in
        // Replace this logic with your actual authentication check
        const isSignedIn = false; // Set to true if user is signed in
        document.addEventListener('DOMContentLoaded', function() {
            if (isSignedIn) {
                document.getElementById('signin-link').style.display = 'none';
                document.getElementById('profile-link').style.display = 'inline-block';
                document.getElementById('logout-link').style.display = 'inline-block';
            }
        });

       