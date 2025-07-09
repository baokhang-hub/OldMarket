document.addEventListener('DOMContentLoaded', () => {
  const postListContainer = document.querySelector('.post-list');

  // Lấy bài đăng chờ duyệt từ server
  async function fetchPendingPosts() {
    try {
      const res = await fetch('php/admin.php?action=get_pending');
      const data = await res.json();
      if (data.status === 'success') {
        return data.data; // mảng bài đăng
      } else {
        alert('Lỗi khi lấy bài đăng: ' + data.message);
        return [];
      }
    } catch (error) {
      alert('Lỗi kết nối server');
      return [];
    }
  }

  async function updatePostStatus(postId, newStatus) {
    try {
      const formData = new FormData();
      formData.append('action', 'update_status');
      formData.append('post_id', postId);
      formData.append('new_status', newStatus);

      const res = await fetch('php/admin.php', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.status !== 'success') {
        alert('Lỗi cập nhật trạng thái: ' + data.message);
      }
    } catch (error) {
      alert('Lỗi kết nối server khi cập nhật trạng thái');
    }
  }

  async function renderPosts() {
    const pendingPosts = await fetchPendingPosts();

    // Xóa bài cũ (trừ tiêu đề)
    postListContainer.querySelectorAll('.post-item').forEach(el => el.remove());

    if (pendingPosts.length === 0) {
      const empty = document.createElement('p');
      empty.textContent = 'Không có bài đăng chờ duyệt.';
      empty.style.textAlign = 'center';
      postListContainer.appendChild(empty);
      return;
    }

    pendingPosts.forEach(post => {
      const item = document.createElement('div');
      item.className = 'post-item';

      const info = document.createElement('div');
      info.className = 'post-info';

      info.innerHTML = `
        <h4>${post.title}</h4>
        <p><strong>Giá:</strong> ${post.price}đ</p>
        <p><strong>Số lượng:</strong> ${post.quantity}</p>
        <p><strong>Danh mục:</strong> ${post.category} - ${post.subcategory}</p>
        <p><strong>Địa chỉ:</strong> ${post.address}</p>
      `;

      if (post.images) {
  const img = document.createElement('img');
  img.src = '../uploads/' + post.images;  // Thêm dấu '/' ở đầu để dùng đường dẫn tuyệt đối
  img.style.width = '100px';
  img.style.marginTop = '10px';
  info.appendChild(img);
}


      const actions = document.createElement('div');
      actions.className = 'post-actions';

      const approveBtn = document.createElement('button');
      approveBtn.className = 'approve';
      approveBtn.textContent = 'Duyệt';
      approveBtn.onclick = async () => {
        await updatePostStatus(post.id, 'approved');
        renderPosts();
      };

      const rejectBtn = document.createElement('button');
      rejectBtn.className = 'reject';
      rejectBtn.textContent = 'Từ chối';
      rejectBtn.onclick = async () => {
        if (confirm('Bạn có chắc muốn từ chối bài đăng này?')) {
          await updatePostStatus(post.id, 'rejected');
          renderPosts();
        }
      };

      actions.appendChild(approveBtn);
      actions.appendChild(rejectBtn);

      item.appendChild(info);
      item.appendChild(actions);
      postListContainer.appendChild(item);
    });
  }

  renderPosts();
});
