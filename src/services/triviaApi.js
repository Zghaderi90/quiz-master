const BASE_URL = "https://opentdb.com";

// Gets the list of quiz categories from Open Trivia DB
export async function fetchCategories() {
  const response = await fetch(`${BASE_URL}/api_category.php`);

  if (!response.ok) {
    throw new Error(`Server error (${response.status})`);
  }

  const data = await response.json();

  // Sort the categories alphabetically by name
  return data.trivia_categories.sort((a, b) => a.name.localeCompare(b.name));
}