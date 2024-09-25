# Line Extractor UI

This project provides a simple front-end interface to extract and organize lines of text from document images. The application processes text detected in images and groups the words into lines and columns using various algorithms, including customizable thresholds for line and column detection.

## Features

- Upload document images and process them to detect and organize text lines.
- Dynamically group text into columns and lines based on configurable distance thresholds.
- Visual representation of text detection using bounding boxes.
- Hover over text to display line numbers within the detected columns.
- Minimalist and clean user interface for ease of use.

## How It Works

1. **Image Upload**: The user uploads an image containing text.
2. **Text Detection**: The application processes the image and detects the text using bounding boxes around each word.
3. **Line and Column Grouping**: Words are grouped into lines and columns based on their proximity in the x-axis (for columns) and y-axis (for lines).
4. **Interactive UI**: The user can hover over text to see line numbers and interact with detected columns and lines.

## Project Structure

- **Frontend**: Built using React for managing state and rendering the interface.
- **Backend**: Expects an API endpoint to process images and return bounding box data for detected text.
- **SVG Rendering**: Detected text is visualized using SVG to display bounding boxes and interactive hover effects.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/hectorandac/CRAFT-Line-Extractor-FE
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the project:
   ```bash
   npm start
   ```

4. Open the app in your browser at `http://localhost:3000`.

## Usage

1. **Upload Image**: Click on the "Upload Image" button to select a document image from your computer.
2. **Process Image**: The image will be processed, and the detected text will be organized into lines and columns.
3. **Interact**: Hover over detected text to see the line numbers and bounding boxes.

## Dependencies

- **React**: For building the front-end UI.
- **React Icons**: For using icons in the interface.
- **SVG**: For rendering the bounding boxes around the detected text.
- **Backend API**: An endpoint to process images and return text bounding box data (you need to configure this in your project).

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch with your feature/fix: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Submit a pull request.

## License

This project is licensed under the MIT License.