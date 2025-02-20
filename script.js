const GITHUB_USERNAME = "your-username";  // Replace with your GitHub username
const REPO_NAME = "your-repository";  // Replace with your repository name
const FILE_PATH = "blogs.json";  // File where blogs are stored
const GITHUB_API_TOKEN = "your-github-token"; // Replace with your GitHub token

async function publishBlog() {
    let title = document.getElementById("post-title").value;
    let content = document.getElementById("post-content").value;

    if (title.trim() === "" || content.trim() === "") {
        alert("Please enter a title and content!");
        return;
    }

    let newBlog = { title, content, date: new Date().toLocaleString() };

    // Fetch existing blogs from GitHub
    let existingBlogs = await fetchPublishedBlogs(true);
    existingBlogs.push(newBlog);

    // Save updated blogs to GitHub
    saveBlogsToGitHub(existingBlogs);

    // Clear input fields
    document.getElementById("post-title").value = "";
    document.getElementById("post-content").value = "";

    alert("Blog Published Successfully!");
}

async function fetchPublishedBlogs(returnData = false) {
    try {
        let response = await fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/main/${FILE_PATH}`);
        if (!response.ok) throw new Error("File not found");
        let blogs = await response.json();
        if (returnData) return blogs;

        // Display Blogs
        let blogSection = document.getElementById("blog-posts");
        blogSection.innerHTML = ""; // Clear previous posts
        blogs.forEach(blog => {
            let postDiv = document.createElement("div");
            postDiv.classList.add("post");
            postDiv.innerHTML = `<h2>${blog.title}</h2><p>${blog.content}</p><small>Published on: ${blog.date}</small>`;
            blogSection.appendChild(postDiv);
        });

    } catch (error) {
        console.log("No published blogs found or error fetching blogs.");
        if (returnData) return [];
    }
}

async function saveBlogsToGitHub(blogData) {
    let content = btoa(JSON.stringify(blogData, null, 2)); // Convert to Base64

    let response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FILE_PATH}`, {
        method: "PUT",
        headers: {
            "Authorization": `token ${GITHUB_API_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "Updated blog posts",
            content: content,
            sha: await getFileSHA()
        })
    });

    if (response.ok) {
        console.log("Blogs saved to GitHub!");
    } else {
        console.log("Error saving blogs.");
    }
}

async function getFileSHA() {
    try {
        let response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FILE_PATH}`);
        let data = await response.json();
        return data.sha;
    } catch (error) {
        return null;
    }
}

// Fetch blogs when the page loads
fetchPublishedBlogs();

