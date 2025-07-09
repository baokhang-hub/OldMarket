document.addEventListener('DOMContentLoaded', () => {
  const postListContainer = document.querySelector('.post-list');

  let pendingPosts = JSON.parse(localStorage.getItem('pending_posts')) || [];
  let approvedPosts = JSON.parse(localStorage.getItem('approved_posts')) || [];

  const renderPosts = () => {
    // Xóa bài cũ (chừa lại tiêu đề)
    postListContainer.querySelectorAll('.post-item').forEach(el => el.remove());

    if (pendingPosts.length === 0) {
      const empty = document.createElement('p');
      empty.textContent = 'Không có bài đăng chờ duyệt.';
      empty.style.textAlign = 'center';
      postListContainer.appendChild(empty);
      return;
    }

    pendingPosts.forEach((post, index) => {
      const item = document.createElement('div');
      item.className = 'post-item';

      const info = document.createElement('div');
      info.className = 'post-info';
      info.innerHTML = `
        <h4>${post.title}</h4>
        <p><strong>Người đăng:</strong> ${post.user.fullname || post.user.email || 'Ẩn danh'}</p>
        <p><strong>Giá:</strong> ${post.price}đ</p>
        <p><strong>Danh mục:</strong> ${post.category} - ${post.subcategory}</p>
        <p><strong>Địa chỉ:</strong> ${post.address}</p>
      `;

      if (post.image) {
        const img = document.createElement('img');
        img.src = post.image;
        img.style.width = '100px';
        img.style.marginTop = '10px';
        info.appendChild(img);
      }

      const actions = document.createElement('div');
      actions.className = 'post-actions';

      const approveBtn = document.createElement('button');
      approveBtn.className = 'approve';
      approveBtn.textContent = 'Duyệt';
      approveBtn.onclick = () => {
        approvedPosts.push(post);
        pendingPosts.splice(index, 1);
        updateStorage();
        renderPosts();
      };

      const rejectBtn = document.createElement('button');
      rejectBtn.className = 'reject';
      rejectBtn.textContent = 'Từ chối';
      rejectBtn.onclick = () => {
        if (confirm('Bạn có chắc muốn từ chối bài đăng này?')) {
          pendingPosts.splice(index, 1);
          updateStorage();
          renderPosts();
        }
      };

      actions.appendChild(approveBtn);
      actions.appendChild(rejectBtn);

      item.appendChild(info);
      item.appendChild(actions);
      postListContainer.appendChild(item);
    });
  };

  const updateStorage = () => {
    localStorage.setItem('pending_posts', JSON.stringify(pendingPosts));
    localStorage.setItem('approved_posts', JSON.stringify(approvedPosts));
  };

  renderPosts();
});
