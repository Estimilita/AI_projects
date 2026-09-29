const mainSection = document.getElementById("main-section");
const formSection = document.getElementById("form-section");
const addBtn = document.getElementById("add-bookmark-button");
const categoryName = document.querySelector(".category-name");
const categoryDropdown = document.getElementById("category-dropdown");
const closeBtn = document.getElementById("close-form-button");
const bookmarkSection = document.getElementById("bookmark-list-section");
const viewBtn = document.getElementById("view-category-button");
const nameInput = document.getElementById("name");
const urlInput = document.getElementById("url");
const addBtnForm = document.getElementById("add-bookmark-button-form");
const categoryList = document.getElementById("category-list");
const closeListBtn = document.getElementById("close-list-button");
const deleteBtn = document.getElementById("delete-bookmark-button");


 const getBookmarks = () => {
   try {
     const rawData = localStorage.getItem("bookmarks");
     const parsedBookmarks = JSON.parse(rawData);

    // Validate that it is an array and that every item inside has the required keys
     if (
       Array.isArray(parsedBookmarks) &&
       parsedBookmarks.every(
         (bookmark) =>
           typeof bookmark === "object" &&
           bookmark !== null &&
           "name" in bookmark &&
           "category" in bookmark &&
           "url" in bookmark
       )
     ) {
       return parsedBookmarks;
     }

    // If it parsed but failed validation (e.g., it parsed a number or an object without the right keys)
    return [];
  } catch (error) {
    // If JSON.parse fails completely due to bad string data, catch it and return empty array safely
    return [];
  }
};

const saveData = (currentArr, newBookmarks) => {
  currentArr.push(newBookmarks);
  localStorage.setItem("bookmarks", JSON.stringify(currentArr));
}

const displayOrCloseForm = () => {
  mainSection.classList.toggle("hidden");
  formSection.classList.toggle("hidden");
}

addBtn.addEventListener("click", () => {
  const val = categoryDropdown.value;
  categoryName.innerText = val.charAt(0).toUpperCase() + val.slice(1);
  displayOrCloseForm();
})

closeBtn.addEventListener("click", () => {
  displayOrCloseForm();
})

addBtnForm.addEventListener("click", (e) => {
  e.preventDefault();
  const bookmarksObj = {
  name: nameInput.value.trim(),
  category: categoryDropdown.value,
  url: urlInput.value.trim(),
  };
  const currentBookmarks = getBookmarks();
  saveData(currentBookmarks, bookmarksObj);

  nameInput.value = "";
  urlInput.value = "";

  displayOrCloseForm();
})

const displayOrHideCategory = () => {
 mainSection.classList.toggle("hidden");
 bookmarkSection.classList.toggle("hidden");
}

viewBtn.addEventListener("click", () => {
  categoryName.innerText = categoryDropdown.value;
  const fetchedArr = getBookmarks();
  const filteredArr = fetchedArr.filter((bookmark)=> {return bookmark.category === categoryDropdown.value});

if(filteredArr.length === 0) {
  categoryList.innerHTML = `<p>No Bookmarks Found</p>`;
} else {
    const bookmarkHTML = filteredArr.map((bookmark)=> {
    return `<li><input id="${bookmark.name}" type="radio" value="${bookmark.name}" name="selected-bookmark">
    <label for="${bookmark.name}"><a href="${bookmark.url}">${bookmark.name}</a></label>
    </li>
    `
  }).join("");

  categoryList.innerHTML = bookmarkHTML;
}

  displayOrHideCategory();
})

closeListBtn.addEventListener("click", ()=> {
  displayOrHideCategory();
})

deleteBtn.addEventListener("click", ()=> {
  const checkedRadio = document.querySelector("input[name='selected-bookmark']:checked");

  if (!checkedRadio) {
    alert("Please select an item to delete");
    return;
  }

  const bookmarkToDelete = checkedRadio.value;
  const masterList = getBookmarks();

  const updatedListArr = masterList.filter((bookmark) => {
    return bookmark.name !== bookmarkToDelete || bookmark.category !== categoryDropdown.value
  });
  localStorage.setItem("bookmarks", JSON.stringify(updatedListArr));

  const remainingCategoryBookmarks = updatedListArr.filter((b)=> b.category === categoryDropdown.value);

  if (remainingCategoryBookmarks.length === 0) {
    categoryList.innerHTML = `<p>No Bookmarks Found</p>`;
  } else {
    const bookmarkHTML = remainingCategoryBookmarks.map((bookmark)=> {
    return `<li><input id="${bookmark.name}" type="radio" value="${bookmark.name}" name="selected-bookmark">
    <label for="${bookmark.name}"><a href="${bookmark.url}">${bookmark.name}</a></label>
    </li>
    `
  }).join("");

  categoryList.innerHTML = bookmarkHTML;
  }
})