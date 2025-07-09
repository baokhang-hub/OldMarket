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
    hint.innerHTML = '<i class="fas fa-camera"></i><div>ĐĂNG ẢNH Ở ĐÂY</div>';
    previewArea.appendChild(hint);
    return;
  }

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
      imageFiles = [];
      renderPreview();
    };

    box.appendChild(img);
    box.appendChild(removeBtn);
    previewArea.appendChild(box);
  };
  reader.readAsDataURL(imageFiles[0]);
}

const imageInput = document.createElement('input');
imageInput.type = 'file';
imageInput.accept = 'image/*';
imageInput.multiple = false; // CHỈ CHỌN 1 HÌNH
imageInput.id = 'images';
imageInput.style.display = 'none';
document.body.appendChild(imageInput);

imageInput.addEventListener('change', () => {
  const files = Array.from(imageInput.files).slice(0, 1); // CHỈ 1 FILE
  imageFiles = files;
  renderPreview();
  imageInput.value = '';
});

previewArea.addEventListener('click', function (e) {
  if (e.target.closest('.upload-hint-box')) {
    e.preventDefault();
    imageInput.click();
  }
});

renderPreview();


// ================== KIỂM TRA GIÁ BÁN ==================
const priceInput = document.getElementById('price');
const priceError = document.createElement('div');
priceError.style.color = 'red';
priceError.style.fontSize = '13px';
priceError.style.marginTop = '5px';
priceInput.parentNode.appendChild(priceError);

priceInput.addEventListener('input', () => {
  let rawValue = priceInput.value.replace(/\D/g, '');
  if (rawValue.length > 9) rawValue = rawValue.slice(0, 9);
  const priceValue = parseInt(rawValue) || 0;
  priceInput.value = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  if (priceValue === 0) {
    priceError.textContent = 'Giá không được để trống.';
  } else if (priceValue < 10000) {
    priceError.textContent = 'Giá phải lớn hơn hoặc bằng 10.000 đồng.';
  } else if (priceValue > 200000000) {
    priceError.textContent = 'Giá không được vượt quá 200.000.000 đồng.';
  } else {
    priceError.textContent = '';
  }
});

// ================== PHẦN CHỌN ĐỊA CHỈ DẠNG POPUP ==================
const selectAddressBox = document.getElementById("select-address");
const addressPopup = document.getElementById("address-popup");
const addressOptions = document.getElementById("address-options");
const addressTitle = document.getElementById("address-step-title");
const backAddressBtn = document.getElementById("back-address");
const confirmAddressBtn = document.getElementById("confirm-address");
const addressInput = document.getElementById("address");
const specificAddressGroup = document.getElementById("specific-address-group");
const specificAddressInput = document.getElementById("specific-address");

let addressData = {
  province: null,
  district: null,
  ward: null,
};
let currentStep = "province";

const API = "https://provinces.open-api.vn/api/";

function openAddressPopup() {
  currentStep = "province";
  addressData = { province: null, district: null, ward: null };
  addressPopup.style.display = "flex";
  backAddressBtn.style.display = "none";
  confirmAddressBtn.style.display = "none";
  specificAddressGroup.style.display = "none";
  specificAddressInput.value = "";
  loadProvinces();
}

function loadProvinces() {
  addressTitle.textContent = "Chọn Tỉnh/Thành";
  specificAddressGroup.style.display = "none";
  confirmAddressBtn.style.display = "none";
  axios.get(API + "?depth=1").then((res) => {
    renderOptions(res.data, "province");
  });
}

function loadDistricts(code) {
  addressTitle.textContent = "Chọn Quận/Huyện";
  specificAddressGroup.style.display = "none";
  confirmAddressBtn.style.display = "none";
  axios.get(API + "p/" + code + "?depth=2").then((res) => {
    renderOptions(res.data.districts, "district");
  });
}

function loadWards(code) {
  addressTitle.textContent = "Chọn Phường/Xã";
  specificAddressGroup.style.display = "none";
  confirmAddressBtn.style.display = "none";
  axios.get(API + "d/" + code + "?depth=2").then((res) => {
    renderOptions(res.data.wards, "ward");
  });
}

function renderOptions(data, type) {
  addressOptions.innerHTML = "";
  data.forEach((item) => {
    const div = document.createElement("div");
    div.className = "address-option";
    div.textContent = item.name;
    div.onclick = () => {
      if (type === "province") {
        addressData.province = item;
        addressData.district = null;
        addressData.ward = null;
        loadDistricts(item.code);
        currentStep = "district";
        backAddressBtn.style.display = "inline-block";
        specificAddressGroup.style.display = "none";
        confirmAddressBtn.style.display = "none";
      } else if (type === "district") {
        addressData.district = item;
        addressData.ward = null;
        loadWards(item.code);
        currentStep = "ward";
        specificAddressGroup.style.display = "none";
        confirmAddressBtn.style.display = "none";
      } else if (type === "ward") {
        addressData.ward = item;
        currentStep = "specific";
        // Ẩn danh sách xã/phường để hiện ô nhập địa chỉ cụ thể
        addressOptions.innerHTML = "";
        specificAddressGroup.style.display = "block";
        specificAddressInput.value = "";
        confirmAddressBtn.style.display = "none"; // ẩn nút xác nhận cho đến khi nhập
        specificAddressInput.focus();
      }
    };
    addressOptions.appendChild(div);
  });
}

// Đăng tin 
selectAddressBox.addEventListener("click", openAddressPopup);

backAddressBtn.addEventListener("click", () => {
  confirmAddressBtn.style.display = "none";
  specificAddressGroup.style.display = "none";
  specificAddressInput.value = "";
  if (currentStep === "district") {
    currentStep = "province";
    addressData.district = null;
    loadProvinces();
    backAddressBtn.style.display = "none";
  } else if (currentStep === "ward") {
    currentStep = "district";
    addressData.ward = null;
    loadDistricts(addressData.province.code);
  } else if (currentStep === "specific") {
    currentStep = "ward";
    loadWards(addressData.district.code);
  }
});

specificAddressInput.addEventListener("input", () => {
  if (specificAddressInput.value.trim().length > 0) {
    confirmAddressBtn.style.display = "inline-block";
  } else {
    confirmAddressBtn.style.display = "none";
  }
});

confirmAddressBtn.addEventListener("click", () => {
  if (
    addressData.province &&
    addressData.district &&
    addressData.ward &&
    specificAddressInput.value.trim() !== ""
  ) {
    const fullAddress = `${specificAddressInput.value.trim()}, ${addressData.ward.name}, ${addressData.district.name}, ${addressData.province.name}`;
    addressInput.value = fullAddress;
    selectAddressBox.textContent = fullAddress;
    addressPopup.style.display = "none";

    specificAddressInput.value = "";
    specificAddressGroup.style.display = "none";
    confirmAddressBtn.style.display = "none";
  } else {
    alert("Vui lòng nhập đầy đủ địa chỉ cụ thể.");
  }
});

addressPopup.addEventListener("click", (e) => {
  if (e.target.classList.contains("popup-overlay")) {
    addressPopup.style.display = "none";
  }
});

const sellForm = document.getElementById("sell-form");

sellForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const category = categoryInput.value;
  const subcategory = subcategoryInput.value;
  const condition = document.getElementById("condition").value;
  const cleanedPriceString = priceInput.value.replace(/\./g, '');
  const price = parseFloat(cleanedPriceString);
  const quantity = parseInt(document.getElementById("quantity").value);
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const address = addressInput.value;

  if (!category || !subcategory || !condition || !price || !quantity || !title || !description || !address || imageFiles.length === 0) {
    alert("Vui lòng điền đầy đủ thông tin và chọn ảnh.");
    return;
  }

  const reader = new FileReader();
reader.onload = function (e) {
  const imageBase64 = e.target.result;

  const postData = {
    category,
    subcategory,
    condition,
    price,
    quantity,
    title,
    description,
    address,
    image: imageBase64   // ✅ Sửa chỗ này
  };

  axios.post("php/sell.php", postData, {
    withCredentials: true
  })
  .then(res => {
    alert("Đăng tin thành công!");
    sellForm.reset();
    categorySelect.textContent = "-- Chọn danh mục --";
    selectAddressBox.textContent = "-- Chọn địa chỉ --";
    imageFiles = [];
    renderPreview();
  })
  .catch(err => {
    const message = err.response?.data?.message || "Có lỗi xảy ra khi đăng tin.";
    alert("Lỗi: " + message);
  });
};


  reader.readAsDataURL(imageFiles[0]);
});


// ================== NÚT TĂNG / GIẢM SỐ LƯỢNG ==================
function changeQty(delta) {
  const input = document.getElementById('quantity');
  let current = parseInt(input.value) || 1;
  current += delta;
  input.value = Math.max(1, Math.min(current, 1000));
}

// Khi người dùng nhập tay
document.getElementById('quantity').addEventListener('input', function () {
  let value = parseInt(this.value) || 1;
  if (value < 1) value = 1;
  if (value > 1000) value = 1000;
  this.value = value;
});