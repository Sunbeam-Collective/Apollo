function getSnappedListItem() {
  const ratePicker = document.querySelector('ul.rate-picker'); // Get the UL element
  const listItems = ratePicker.querySelectorAll('li.rate-value'); // Get all list items
  const scrollLeft = ratePicker.scrollLeft; // Current horizontal scroll position
  const containerWidth = ratePicker.offsetWidth; // Visible width of the container

  let snappedItem = null;
  let minDistance = Infinity; // Start with a very large distance

  listItems.forEach((item) => {
    // Calculate the item's horizontal position relative to the container
    const itemLeft = item.offsetLeft;  // Distance from the left edge of the parent
    const itemWidth = item.offsetWidth; // Width of the list item
    const itemCenter = itemLeft + (itemWidth / 2);  // Center position of the item

    const containerCenter = scrollLeft + (containerWidth / 2); // Center of the visible container

    const distance = Math.abs(itemCenter - containerCenter); // Distance between the item's center and the container's center

    if (distance < minDistance) {
      minDistance = distance;
      snappedItem = item; // Update the snapped item
    }
  });

  return snappedItem; // Returns the DOM element of the snapped list item (or null if none found)
}

export {
  getSnappedListItem
}
