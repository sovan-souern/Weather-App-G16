document.addEventListener("DOMContentLoaded", () => {
    const images = [
        "https://i.pinimg.com/736x/35/df/b0/35dfb0d1d9daf2aa87b8cbcc9024ebab.jpg",
        "https://i.pinimg.com/736x/35/df/b0/35dfb0d1d9daf2aa87b8cbcc9024ebab.jpg",
        "https://i.pinimg.com/736x/d9/d2/82/d9d282bfd1842ef06e706a12679e7e49.jpg"
    ];
    let currentIndex = 0;

    const imageElement = document.getElementById("changingImage");

    // Set a fixed size for the image using JavaScript
    imageElement.style.width = "500px"; 
    imageElement.style.height = "300px"; 
    imageElement.style.objectFit = "cover"; 

    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    // Change the image every 3 seconds
    setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        imageElement.src = images[currentIndex];
    }, 3000);
});


