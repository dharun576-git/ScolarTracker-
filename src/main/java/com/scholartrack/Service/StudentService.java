package com.scholartrack.Service;

import com.scholartrack.Model.Student;
import com.scholartrack.Repo.StudentRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepo studentRepo;

    public StudentService(StudentRepo studentRepo) {
        this.studentRepo = studentRepo;
    }

    public Student createStudent(Student student) {

        if (studentRepo.existsByEmail(student.getEmail())) {
            throw new RuntimeException("Student with this email already exists");
        }

        return studentRepo.save(student);
    }

    public List<Student> getAllStudents() {
        return studentRepo.findAll();
    }

    public Student getStudentById(Long id) {

        return studentRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Student not found with ID: " + id));
    }

    public Student updateStudent(Long id, Student updatedStudent) {

        Student student = getStudentById(id);

        student.setName(updatedStudent.getName());
        student.setEmail(updatedStudent.getEmail());
        student.setPhone(updatedStudent.getPhone());
        student.setAnnualIncome(updatedStudent.getAnnualIncome());
        student.setMarks(updatedStudent.getMarks());
        student.setCourse(updatedStudent.getCourse());
        student.setYear(updatedStudent.getYear());

        return studentRepo.save(student);
    }

    public void deleteStudent(Long id) {

        Student student = getStudentById(id);

        studentRepo.delete(student);
    }
}