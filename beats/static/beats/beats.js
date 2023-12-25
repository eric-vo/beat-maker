const defaultCopyButtonText = 'Copy Link';
const defaultDeleteButtonText = 'Delete';

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.copy-button').forEach(copyButton => {
        copyButton.onclick = () => {
            // Get the URL from the "Load Beat" button
            const url = copyButton.parentElement.querySelector('a').href;
            navigator.clipboard.writeText(url);

            copyButton.innerHTML = 'Copied!';
            setTimeout(() => {
                copyButton.innerHTML = defaultCopyButtonText;
            }, 1500);
        };
    });

    document.querySelectorAll('.delete-form').forEach(deleteForm => {
        deleteForm.onsubmit = () => {
            const deleteButton = deleteForm.querySelector('button');

            if (!deleteButton.classList.contains('confirm-delete')) {
                deleteButton.classList.add('confirm-delete');
                deleteButton.innerHTML = 'Confirm Delete?';

                setTimeout(() => {
                    deleteButton.classList.remove('confirm-delete');
                    deleteButton.innerHTML = defaultDeleteButtonText;
                }, 3000);

                return false;
            }
        };
    });
});
