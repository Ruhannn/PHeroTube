const tabContainer = document.getElementById("tab-container");
const videosContainer = document.getElementById("videos-container");
const alertContainer = document.getElementById("alertContainer");
const sortByViewsButton = document.getElementById("sort-by-views");
let videosData = [];
fetch("https://openapi.programming-hero.com/api/videos/categories")
  .then((response) => response.json())
  .then((data) => {
    const firstCategory = data.data[0];
    displayVideo(firstCategory.category_id);
    data.data.forEach((category) => {
      const tabBtn = document.createElement("button");
      tabBtn.innerHTML = `
        <button class="transition-all duration-300 font-medium bg-opacity-60 bg-gray-600 text-gray-900 py-2 px-5 rounded hover:bg-red-500 hover:text-white" category-btn>
          ${category.category}
        </button>`;
      tabBtn.addEventListener("click", () => {
        const id = category.category_id;
        displayVideo(id);
      });
      tabContainer.appendChild(tabBtn);
    });
  });
  // sort by views
sortByViewsButton.addEventListener("click", () => {
  videosData.sort(
    (a, b) => convertToNumber(b.others.views) - convertToNumber(a.others.views)
  );
  displaySortedVideo();
});
function convertToNumber(viewsString) {
  const numericString = viewsString.replace(/[^0-9]/g, "");
  const viewsNumber = parseInt(numericString);
  return viewsNumber;
}
function displayVideo(x) {
  videosContainer.innerHTML = "";
  fetch(` https://openapi.programming-hero.com/api/videos/category/${x}`)
    .then((response) => response.json())
    .then((data) => {
      const status = data.status;
      if (status === true) {
        alertContainer.classList.add("hidden");
        videosData = data.data;
        displaySortedVideo();
      } else if (status === false) {
        alertContainer.innerHTML = "";
        alertContainer.classList.remove("hidden");
        const noDataPage = document.createElement("div");
        noDataPage.innerHTML = `
          <div class="grid place-items-center h-screen">
            <div class="text-center">
              <img src="images/a.png" class="mx-auto" />
              <h1 class="text-3xl font-semibold mt-6">
                Oops!! Sorry, There is no content here
              </h1>
            </div>
          </div>`;
        alertContainer.appendChild(noDataPage);
      }
    });
}
function displaySortedVideo() {
  videosContainer.innerHTML = "";
  videosData.forEach((video) => {
    const videoElement = document.createElement("div");
    const totalSeconds = video.others.posted_date;
    const hours = Math.floor(totalSeconds / 3600);
    const secondsAfterHours = totalSeconds % 3600;
    const minutes = Math.floor(secondsAfterHours / 60);
    const time = `${hours}hrs ${minutes}min ago`;

    videoElement.innerHTML = `
      <div class="relative">
        <img class="w-full h-52 object-cover rounded-lg" src="${
          video.thumbnail
        }" alt="Video Thumbnail" />
        <div class="absolute bottom-0 right-0 m-2 p-1 text-white bg-black bg-opacity-60 rounded ${
          video.others.posted_date ? "" : "hidden"
        }">
          ${time || "N/A"}
        </div>
      </div>
      <div class="flex gap-3 mt-3">
        <div>
          <img class="w-[40px] h-[40px] rounded-full" src="${
            video.authors[0].profile_picture
          }" alt="Author Profile" />
        </div>
        <div>
          <h1 class="text-gray-900 text-lg font-semibold leading-7 break-words">${
            video.title
          }</h1>
          <div class="flex gap-2 items-center">
            <h1 class="text-gray-700 text-sm">${
              video.authors[0].profile_name
            }</h1>
            <img src="${
              video.authors[0].verified === true ? "images/verified.svg" : ""
            }" class="${video.authors[0].verified !== true ? "hidden" : ""}">
          </div>
          <h1 class="text-gray-700 text-sm">${video.others.views} views</h1>
        </div>
      </div>`;
    videosContainer.appendChild(videoElement);
  });
}
