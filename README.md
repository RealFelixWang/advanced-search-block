# Advanced Search Block

A powerful WordPress advanced search block plugin that provides a search interface with category and tag filtering capabilities.

## Features

- **Keyword Search** - Support keyword search in post titles and content
- **Category Filtering** - Filter posts by category
- **Tag Filtering** - Filter posts by tags (configurable to show/hide)
- **Pagination** - Support paginated display of search results (configurable to show/hide)
- **Configurable Posts Per Page** - Customize the number of posts displayed per page
- **URL Parameter Support** - Search conditions are saved in URL, supporting sharing and bookmarks
- **Responsive Design** - Adapt to various screen sizes
- **AJAX Search** - Get search results without page refresh using AJAX technology

## Installation

1. Upload the plugin folder to the `/wp-content/plugins/` directory
2. Activate the "Advanced Search Block" plugin in the WordPress admin "Plugins" page
3. Add the "Advanced Search Block" block in the page or post editor

## Usage

### In the Editor

1. In the WordPress editor, click the "+" button to add a new block
2. Search for "Advanced Search" or browse the "Widgets" category
3. Select the "Advanced Search Block" block
4. Configure block options in the settings panel on the right:
   - **Show Tags** - Whether to display the tag filter
   - **Show Pagination** - Whether to display pagination
   - **Posts Per Page** - Number of posts to display per page

### On the Frontend

1. Enter keywords in the search box
2. Select categories and/or tags to filter (optional)
3. Click the "Search" button
4. Browse search results and use pagination navigation to view more results

## Technical Implementation

### Frontend Technologies

- **React** - For building user interfaces
- **TypeScript** - Provides type safety
- **SCSS** - For styling
- **WordPress REST API** - For data fetching

### Backend Technologies

- **PHP** - WordPress plugin development language
- **WordPress REST API** - Provides custom API endpoints
- **WordPress Block Editor** - Integration with Gutenberg editor

## API Endpoints

The plugin registers the following custom REST API endpoints:

- `GET /wp-json/advanced-search/v1/categories` - Get all categories
- `GET /wp-json/advanced-search/v1/tags` - Get all tags
- `GET /wp-json/advanced-search/v1/search` - Perform search

### Search Parameters

- `q` - Search keyword
- `cat` - Category ID
- `tags[]` - Array of tag IDs
- `page` - Page number
- `per_page` - Number of posts per page

## Custom Development

### Modifying Styles

Plugin styles are located in the `src/style.scss` file. After modification, you need to run the build command:

```bash
npm run build
```

### Extending Functionality

1. Add new type definitions in `src/types.ts`
2. Create new components in the `src/components/` directory
3. Add new API endpoints in `includes/class-advanced-search-block.php`

## Development Environment Setup

1. Clone the repository to the plugin directory
2. Install dependencies:

```bash
npm install
```

3. Development mode (automatically watch for file changes):

```bash
npm run start
```

4. Build production version:

```bash
npm run build
```

## Version History

### 1.0.0
- Initial version
- Basic search functionality
- Category and tag filtering
- Pagination functionality
- Configurable options

## Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Create a Pull Request

## License

This project is licensed under the GPL-2.0 License - see the [LICENSE](LICENSE) file for details

## Support

If you encounter any issues or have feature suggestions, please create an issue in the [GitHub Issues](https://github.com/RealFelixWang/advanced-search-block/issues).

## Author

- **FelixWang** - Initial developer
  - GitHub: [RealFelixWang](https://github.com/RealFelixWang)
  - Repository: [advanced-search-block](https://github.com/RealFelixWang/advanced-search-block)

## Acknowledgments

- WordPress Block Editor API
- React framework
- All contributors and users for their support