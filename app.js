// app.js
function fetchPosts() {
    fetch('/api/posts')
        .then(response => response.json())
        .then(posts => {
            const postList = document.querySelector('#postList');
            postList.innerHTML = ''; // 기존 목록을 지우고 새로 시작
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'post';
                postElement.innerHTML = `
                    <h2>${post.title}</h2>
                    <p>${post.content}</p>
                    <span>Posted on ${new Date(post.createdAt).toLocaleString()}</span>
                `;
                postList.appendChild(postElement);
            });
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('postForm');
    const postsContainer = document.getElementById('postsContainer');

    // 게시글 목록 로드 함수
    const loadPosts = async () => {
        const response = await fetch(`https://port-0-board-qxz2eltqtrgkd.sel5.cloudtype.app/api/posts`);
        if (!response.ok) {
            // 오류 처리
            console.error('서버에서 오류 응답:', response.statusText);
            return;
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            // 오류 처리
            console.error('유효하지 않은 응답 타입:', contentType);
            return;
        }

        const posts = await response.json();
        postsContainer.innerHTML = posts.map(post => `
            <div class="mb-4 p-4 border border-gray-300">
                <h2 class="text-lg font-bold">${post.title}</h2>
                <p>${post.content}</p>
                <span class="text-sm text-gray-600">${new Date(post.createdAt).toLocaleString()}</span>
            </div>
        `).join('');
    };

    // 게시글 폼 제출 이벤트 리스너
    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(postForm);
        const data = {
            title: formData.get('title'),
            content: formData.get('content')
        };
        await fetch('https://port-0-board-qxz2eltqtrgkd.sel5.cloudtype.app/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        postForm.reset(); // 폼 리셋
        loadPosts(); // 게시글 목록 다시 로드
    });

    // 초기 게시글 목록 로드
    loadPosts();
});

