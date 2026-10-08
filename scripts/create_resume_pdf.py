import os

def create_pdf(filename):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    
    # We will write a valid PDF 1.4 file
    lines = [
        "BT",
        "/F1 20 Tf",
        "50 780 Td",
        "(AKSHAT BALOTHIYA) Tj",
        "ET",
        
        "BT",
        "/F1 10 Tf",
        "50 762 Td",
        "(AI / MACHINE LEARNING ENGINEER - PYTHON DEVELOPER - B.TECH ENGINEERING STUDENT) Tj",
        "ET",
        
        "BT",
        "/F1 9 Tf",
        "50 748 Td",
        "(akahatbalothiya@gmail.com | 7987015566 | linkedin.com/in/akshat-balothiya-a552aa360 | CGPA: 7.0) Tj",
        "ET",
        
        "BT",
        "/F1 12 Tf",
        "50 722 Td",
        "(PROFESSIONAL SUMMARY) Tj",
        "ET",
        
        "BT",
        "/F1 8.5 Tf",
        "50 706 Td",
        "(Results-driven B.Tech Engineering student specializing in AI, Machine Learning, and Python-based software) Tj",
        "0 -12 Td",
        "(development. Proven ability to design and ship AI-powered applications, translating machine learning fundamentals) Tj",
        "0 -12 Td",
        "(into working, real-world products. Hackathon and ideathon winner rapidly prototyping innovative tech solutions.) Tj",
        "ET",
        
        "BT",
        "/F1 12 Tf",
        "50 660 Td",
        "(TECHNICAL SKILLS) Tj",
        "ET",
        
        "BT",
        "/F1 8.5 Tf",
        "50 644 Td",
        "(AI / ML / DL: Machine Learning, Deep Learning, Generative AI, Groq / LLaMA-3.3, Whisper, Graph Anomaly Detection) Tj",
        "0 -12 Td",
        "(Programming Languages: Python, Java, C, JavaScript, TypeScript) Tj",
        "0 -12 Td",
        "(Web & App Development: React Native, HTML, CSS, REST APIs) Tj",
        "0 -12 Td",
        "(Data & Databases: SQL, Data Structures & Algorithms, Problem Solving, Git, GitHub, TMDB API) Tj",
        "ET",
        
        "BT",
        "/F1 12 Tf",
        "50 584 Td",
        "(PROJECTS) Tj",
        "ET",
        
        "BT",
        "/F1 9.5 Tf",
        "50 568 Td",
        "(CryptoTrace | Python, LLM (Groq LLaMA-3.3), Speech Recognition (Whisper), Graph-Based ML) Tj",
        "ET",
        
        "BT",
        "/F1 8.5 Tf",
        "50 554 Td",
        "(- Engineered an AI-powered blockchain fraud-analytics platform for Smart India Hackathon 2026.) Tj",
        "0 -11 Td",
        "(- Integrated Groq LLaMA-3.3-70B LLM to generate explainable plain-language fraud-risk reasoning.) Tj",
        "0 -11 Td",
        "(- Built multilingual speech-to-data pipeline using Groq Whisper converting voice complaints under 2 mins.) Tj",
        "0 -11 Td",
        "(- Designed graph-based anomaly-detection heuristics cutting manual investigation from 2-3 weeks to under 10 mins.) Tj",
        "ET",
        
        "BT",
        "/F1 9.5 Tf",
        "50 496 Td",
        "(Rural Hart | Web Platform, Full-Stack Development) Tj",
        "ET",
        
        "BT",
        "/F1 8.5 Tf",
        "50 482 Td",
        "(- Built a digital platform connecting rural artisans directly with customers to expand market access.) Tj",
        "0 -11 Td",
        "(- Focused on an intuitive, accessible user experience to bridge the digital divide for non-technical users.) Tj",
        "ET",
        
        "BT",
        "/F1 9.5 Tf",
        "50 446 Td",
        "(BingeBolt | React Native, TMDB API) Tj",
        "ET",
        
        "BT",
        "/F1 8.5 Tf",
        "50 432 Td",
        "(- Developed cross-platform movie discovery mobile app in React Native integrated with TMDB API.) Tj",
        "0 -11 Td",
        "(- Implemented clean, responsive UI/UX to deliver a smooth browsing and discovery experience.) Tj",
        "ET",
        
        "BT",
        "/F1 12 Tf",
        "50 396 Td",
        "(ACHIEVEMENTS) Tj",
        "ET",
        
        "BT",
        "/F1 8.5 Tf",
        "50 380 Td",
        "(- Winner - College Hackathon: recognized for building innovative tech solution under time constraints.) Tj",
        "0 -11 Td",
        "(- Winner - College Ideathon: awarded for original problem-solving and technology-driven idea development.) Tj",
        "0 -11 Td",
        "(- Delivered multiple real-world software projects spanning AI, web, and mobile development.) Tj",
        "ET",
        
        "BT",
        "/F1 12 Tf",
        "50 332 Td",
        "(CERTIFICATIONS) Tj",
        "ET",
        
        "BT",
        "/F1 8.5 Tf",
        "50 316 Td",
        "(- Java & Data Structures and Algorithms - Sheryians Coding School (Mar 2025 - Oct 2025)) Tj",
        "0 -11 Td",
        "(- Machine Learning Fundamentals | Artificial Intelligence Fundamentals | Python Programming) Tj",
        "ET"
    ]
    
    stream_content = "\n".join(lines).encode('latin-1')
    stream_len = len(stream_content)
    
    pdf_content = bytearray()
    offsets = []
    
    def add_obj(obj_str):
        offsets.append(len(pdf_content))
        pdf_content.extend(obj_str.encode('latin-1'))
        
    pdf_content.extend(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
    
    # 1: Catalog
    add_obj("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n")
    # 2: Pages
    add_obj("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n")
    # 3: Page
    add_obj("3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n")
    # 4: Stream
    stream_header = f"4 0 obj\n<< /Length {stream_len} >>\nstream\n".encode('latin-1')
    offsets.append(len(pdf_content))
    pdf_content.extend(stream_header)
    pdf_content.extend(stream_content)
    pdf_content.extend(b"\nendstream\nendobj\n")
    # 5: Font
    add_obj("5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n")
    
    # XRef
    xref_offset = len(pdf_content)
    pdf_content.extend(f"xref\n0 {len(offsets) + 1}\n0000000000 65535 f \n".encode('latin-1'))
    for off in offsets:
        pdf_content.extend(f"{off:010d} 00000 n \n".encode('latin-1'))
        
    pdf_content.extend(f"trailer\n<< /Size {len(offsets) + 1} /Root 1 0 R >>\nstartxref\n{xref_offset}\n%%EOF\n".encode('latin-1'))
    
    with open(filename, 'wb') as f:
        f.write(pdf_content)
    print("Created", filename)

if __name__ == '__main__':
    create_pdf('public/Akshat_Balothiya_Resume.pdf')
