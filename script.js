function addPost() {
    let title = document.getElementById("post-title").value;
    let content = document.getElementById("post-content").value;

    if (title.trim() === "" || content.trim() === "") {
        alert("Please fill in both fields!");
        return;
    }

    let postSection = document.getElementById("blog-posts");

    let postDiv = document.createElement("div");
    postDiv.classList.add("post");

    let postTitle = document.createElement("h2");
    postTitle.textContent = title;

    let postContent = document.createElement("p");
    postContent.textContent = content;

    postDiv.appendChild(postTitle);
    postDiv.appendChild(postContent);
    postSection.prepend(postDiv);

    // Clear input fields
    document.getElementById("post-title").value = "";
    document.getElementById("post-content").value = "";
}
