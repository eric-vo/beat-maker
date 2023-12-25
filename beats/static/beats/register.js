document.addEventListener('DOMContentLoaded', () => {
    const url = new URL(window.location.href);
    const next = url.searchParams.get('next');

    if (next) {
        document.querySelector('#login-link').href = `/login?next=${encodeURIComponent(next)}`;
    }
});
