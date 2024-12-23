def split_file(file_path, chunk_size=60*1024*1024):
    with open(file_path, 'rb') as f:
        chunk_num = 1
        while True:
            chunk = f.read(chunk_size)
            if not chunk:
                break
            # 写入每个分割后的文件
            with open(f'{file_path}_part_{chunk_num}', 'wb') as chunk_file:
                chunk_file.write(chunk)
            chunk_num += 1

# 示例用法
split_file('Washed4.csv')  
