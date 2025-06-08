# ocean_mind_frontend

frontend project for Ocean Mind

Khi bạn cập nhật mã nguồn trong dự án của mình và muốn chạy lại trên Docker, bạn sẽ cần làm theo các bước sau để xây dựng lại Docker container và áp dụng các thay đổi:

### Bước 1: Cập nhật mã nguồn trong dự án

1. **Cập nhật mã nguồn** trong thư mục `src` hoặc các tệp cần thay đổi (ví dụ: thay đổi `index.html`, `js`, `css`).

### Bước 2: Build lại ứng dụng (nếu cần thiết)

1. Chạy lại lệnh **build** để biên dịch lại mã nguồn (nếu có thay đổi trong mã nguồn):
   ```bash
   npm run build
   ```
   Điều này sẽ cập nhật các tệp trong thư mục `dist` với các thay đổi mới.

### Bước 3: Build lại Docker image

1. Sau khi mã nguồn và thư mục `dist` đã được cập nhật, bạn cần **build lại Docker image** để Docker sử dụng các thay đổi mới:
   ```bash
   docker build -t your-image-name .
   ```
   - `your-image-name` là tên bạn muốn gán cho Docker image mới.
   - Dấu `.` chỉ định Dockerfile hiện tại trong thư mục gốc của dự án.

### Bước 4: Dừng container hiện tại (nếu đang chạy)

1. Nếu container cũ đang chạy, bạn cần dừng nó lại:

   ```bash
   docker ps
   ```

   Chạy lệnh trên để xem danh sách các container đang chạy. Ghi lại ID hoặc tên của container bạn muốn dừng.

2. Dừng container:
   ```bash
   docker stop <container_id_or_name>
   ```

### Bước 5: Xóa container cũ (nếu cần)

1. Sau khi dừng container, nếu bạn muốn xóa container cũ, có thể chạy:
   ```bash
   docker rm <container_id_or_name>
   ```

### Bước 6: Chạy lại container mới từ Docker image

1. Sau khi build lại Docker image, chạy lại container với image mới:
   ```bash
   docker run -d -p 80:80 your-image-name
   ```
   - `-d`: Chạy container ở chế độ nền.
   - `-p 80:80`: Ánh xạ cổng 80 của máy chủ với cổng 80 của container.
   - `your-image-name`: Tên của Docker image bạn vừa build.

### Bước 7: Kiểm tra kết quả

- Mở trình duyệt và kiểm tra xem các thay đổi đã được cập nhật trên ứng dụng của bạn chưa (thông qua `http://localhost` hoặc địa chỉ IP của máy chủ).

### Lưu ý:

- Nếu bạn đang sử dụng **docker-compose** để quản lý các dịch vụ, bạn có thể dễ dàng rebuild và khởi động lại toàn bộ stack dịch vụ với lệnh sau:
  ```bash
  docker-compose up --build
  ```

Các bước này sẽ giúp bạn cập nhật ứng dụng và chạy lại trên Docker sau khi thay đổi mã nguồn.
