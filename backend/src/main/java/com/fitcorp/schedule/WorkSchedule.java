package com.fitcorp.schedule;

import com.fitcorp.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.time.LocalTime;

@Entity
@Table(name = "work_schedules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkSchedule {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "day_of_week", nullable = false, length = 20)
    private String dayOfWeek;

    @Builder.Default
    @Column(name = "is_working_day")
    private Boolean isWorkingDay = true;

    @Column(name = "work_start_time")
    private LocalTime workStartTime;

    @Column(name = "work_end_time")
    private LocalTime workEndTime;

    @Builder.Default
    @Column(name = "morning_break_minutes")
    private Integer morningBreakMinutes = 15;

    @Builder.Default
    @Column(name = "lunch_break_minutes")
    private Integer lunchBreakMinutes = 60;

    @Builder.Default
    @Column(name = "evening_break_minutes")
    private Integer eveningBreakMinutes = 15;

    @Builder.Default
    @Column(name = "preferred_workout_window", length = 50)
    private String preferredWorkoutWindow = "EVENING"; // MORNING, LUNCH, EVENING, WEEKEND

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;
}
