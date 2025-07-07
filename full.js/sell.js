// ================== PHẦN CHỌN DANH MỤC ==================
const categorySelect = document.getElementById('category-select');
const popup = document.getElementById('popup');
const categoryList = document.getElementById('category-list');
const categoryInput = document.getElementById('category');
const subcategoryInput = document.getElementById('subcategory');

const categories = {
  'Thiết bị điện tử': ['Điện thoại', 'Máy tính bảng', 'Laptop'],
  'Đồ gia dụng': ['Tủ lạnh', 'Máy giặt', 'Lò vi sóng'],
  'Sở thích': ['Sách', 'Nhạc cụ', 'Đồ sưu tầm'],
  'Thời trang': ['Quần áo', 'Giày dép', 'Phụ kiện']
};

let currentCategory = '';

function showMainCategories() {
  categoryList.innerHTML = '';
  for (let cat in categories) {
    const div = document.createElement('div');
    div.textContent = cat;
    div.onclick = () => {
      currentCategory = cat;
      showSubCategories(cat);
    };
    categoryList.appendChild(div);
  }
}

function showSubCategories(cat) {
  categoryList.innerHTML = '';
  const backBtn = document.createElement('div');
  backBtn.textContent = '← Quay lại';
  backBtn.className = 'back-button';
  backBtn.onclick = showMainCategories;
  categoryList.appendChild(backBtn);

  categories[cat].forEach(sub => {
    const div = document.createElement('div');
    div.textContent = sub;
    div.onclick = () => {
      categorySelect.textContent = `${currentCategory} - ${sub}`;
      categoryInput.value = currentCategory;
      subcategoryInput.value = sub;
      popup.style.display = 'none';
    };
    categoryList.appendChild(div);
  });
}

categorySelect.addEventListener('click', () => {
  popup.style.display = 'flex';
  showMainCategories();
});

popup.addEventListener('click', (e) => {
  if (e.target.classList.contains('popup-overlay')) {
    popup.style.display = 'none';
  }
});

// ================== PHẦN ẢNH ==================
const previewArea = document.getElementById('preview');
let imageFiles = [];

function renderPreview() {
  previewArea.innerHTML = '';
  if (imageFiles.length === 0) {
    const hint = document.createElement('div');
    hint.className = 'upload-hint-box';
    hint.innerHTML = '<i class="fas fa-camera"></i><div>ĐĂNG TỪ 01 ĐẾN 06 HÌNH</div>';
    previewArea.appendChild(hint);
    return;
  }

  imageFiles.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const box = document.createElement('div');
      box.className = 'preview-box';
      const img = document.createElement('img');
      img.src = e.target.result;

      const removeBtn = document.createElement('button');
      removeBtn.textContent = '×';
      removeBtn.className = 'remove-btn';
      removeBtn.onclick = () => {
        imageFiles.splice(index, 1);
        renderPreview();
      };

      box.appendChild(img);
      box.appendChild(removeBtn);
      previewArea.appendChild(box);
    };
    reader.readAsDataURL(file);
  });

  if (imageFiles.length < 6) {
    const addBox = document.createElement('label');
    addBox.className = 'add-more-box';
    addBox.textContent = '+';
    addBox.htmlFor = 'images';
    previewArea.appendChild(addBox);
  }
}

const imageInput = document.createElement('input');
imageInput.type = 'file';
imageInput.accept = 'image/*';
imageInput.multiple = true;
imageInput.id = 'images';
imageInput.style.display = 'none';
document.body.appendChild(imageInput);

imageInput.addEventListener('change', () => {
  const files = Array.from(imageInput.files);
  imageFiles = imageFiles.concat(files).slice(0, 6);
  renderPreview();
  imageInput.value = '';
});

previewArea.addEventListener('click', function (e) {
  if (e.target.closest('.upload-hint-box') || e.target.closest('.add-more-box')) {
    e.preventDefault();
    imageInput.click();
  }
});

renderPreview();

const priceInput = document.getElementById('price');

// Tạo phần hiển thị lỗi bên dưới input giá
const priceError = document.createElement('div');
priceError.style.color = 'red';
priceError.style.fontSize = '13px';
priceError.style.marginTop = '5px';
priceInput.parentNode.appendChild(priceError);

priceInput.addEventListener('input', () => {
  // Chỉ lấy số, bỏ hết ký tự khác
  let rawValue = priceInput.value.replace(/\D/g, '');
  
  // Giới hạn nhập số max 9 chữ số (200 triệu là 9 chữ số)
  if (rawValue.length > 9) {
    rawValue = rawValue.slice(0, 9);
  }
  
  // Chuyển về số nguyên
  const priceValue = parseInt(rawValue) || 0;
  
  // Format tiền: ví dụ 1234567 thành 1.234.567
  priceInput.value = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  // Kiểm tra giá hợp lệ hay không
  if (priceValue === 0) {
    priceError.textContent = 'Giá không được để trống.';
  } else if (priceValue < 10000) {
    priceError.textContent = 'Giá phải lớn hơn hoặc bằng 10.000 đồng.';
  } else if (priceValue > 200000000) {
    priceError.textContent = 'Giá không được vượt quá 200.000.000 đồng.';
  } else {
    priceError.textContent = ''; // hợp lệ thì ẩn lỗi
  }
});