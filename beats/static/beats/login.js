document.addEventListener('DOMContentLoaded', () => {
    const url = new URL(window.location.href);
    const next = url.searchParams.get('next');

    if (next) {
        document.querySelector('#register-link').href = `/register?next=${encodeURIComponent(next)}`;
    }
});
