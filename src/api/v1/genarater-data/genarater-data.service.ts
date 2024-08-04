import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class GenaraterDataService {
  constructor(private prisma: PrismaService) {}

  async createCategory(): Promise<void> {
    await this.prisma.$executeRaw`
          INSERT INTO public."Category_movie" (name, "desc", delete_at, created_at, updated_at) VALUES
            ('Action', 'Action movies', false, NOW(), NOW()),
            ('Comedy', 'Funny movies', false, NOW(), NOW()),
            ('Drama', 'Emotional movies', false, NOW(), NOW()),
            ('Sci-Fi', 'Science fiction movies', false, NOW(), NOW()),
            ('Horror', 'Scary movies', false, NOW(), NOW()),
            ('Romance', 'Romantic movies', false, NOW(), NOW()),
            ('Animation', 'Animated movies', false, NOW(), NOW()),
            ('Documentary', 'Informative movies', false, NOW(), NOW()),
            ('Thriller', 'Suspenseful movies', false, NOW(), NOW()),
            ('Adventure', 'Exciting movies', false, NOW(), NOW()),
            ('Fantasy', 'Imaginative movies', false, NOW(), NOW()),
            ('Biography', 'Movies about real people', false, NOW(), NOW()),
            ('War', 'Movies about conflicts', false, NOW(), NOW()),
            ('Musical', 'Movies with music and singing', false, NOW(), NOW()),
            ('Crime', 'Movies about criminal activities', false, NOW(), NOW()),
            ('Mystery', 'Movies with puzzles and secrets', false, NOW(), NOW()),
            ('Family', 'Movies suitable for all ages', false, NOW(), NOW()),
            ('Sport', 'Movies about sports and athletes', false, NOW(), NOW()),
            ('Western', 'Movies set in the American Old West', false, NOW(), NOW()),
            ('History', 'Movies based on historical events', false, NOW(), NOW())
        `;
  }

  async createMovie(): Promise<void> {
    await this.prisma.$executeRaw`
      INSERT INTO public."Movie" (
        "name", "desc", "duration", "releaseDate", "imageId", "imagePath", "categoryId", "director", "actor", "language", "urlTrailer", "deleteAt", "createdAt", "updatedAt"
      ) VALUES
        ('Inception', 'A mind-bending sci-fi thriller', 148, '2010-07-16', 'abc123', 'https://th.bing.com/th/id/OIP.o51YcsduW3TM0AjhSuwUAgHaEo?w=273&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7', 4, 'Christopher Nolan', 'Leonardo DiCaprio, Tom Hardy', 'English', 'https://www.youtube.com/watch?v=YoHD9XEInc0', false, NOW(), NOW()),
        ('The Shawshank Redemption', 'A story about friendship and hope', 142, '1994-09-23', 'def456', 'https://th.bing.com/th/id/OIP.o51YcsduW3TM0AjhSuwUAgHaEo?w=273&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7', 3, 'Frank Darabont', 'Tim Robbins, Morgan Freeman', 'English', 'https://www.youtube.com/watch?v=6hB3S9bIaco', false, NOW(), NOW()),
        ('Forrest Gump', 'A heartwarming story of a man with an IQ of 75', 142, '1994-07-06', 'ghi789', 'https://th.bing.com/th/id/OIP.o51YcsduW3TM0AjhSuwUAgHaEo?w=273&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7', 12, 'Robert Zemeckis', 'Tom Hanks, Robin Wright', 'English', 'https://www.youtube.com/watch?v=uPIEn0M8su0', false, NOW(), NOW()),
        ('The Dark Knight', 'A thrilling superhero movie', 152, '2008-07-18', 'jkl012', 'https://th.bing.com/th/id/OIP.o51YcsduW3TM0AjhSuwUAgHaEo?w=273&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7', 1, 'Christopher Nolan', 'Christian Bale, Heath Ledger', 'English', 'https://www.youtube.com/watch?v=EXeTwQWrcwY', false, NOW(), NOW()),
        ('Pulp Fiction', 'A non-linear crime film', 154, '1994-10-14', 'mno345', 'https://th.bing.com/th/id/OIP.o51YcsduW3TM0AjhSuwUAgHaEo?w=273&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7', 15, 'Quentin Tarantino', 'John Travolta, Samuel L. Jackson', 'English', 'https://www.youtube.com/watch?v=s7EdQ4FqbhY', false, NOW(), NOW()),
        ('Inception', 'A mind-bending sci-fi thriller', 148, '2010-07-16', 'abc123', 'https://th.bing.com/th/id/OIP.o51YcsduW3TM0AjhSuwUAgHaEo?w=273&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7', 4, 'Christopher Nolan', 'Leonardo DiCaprio, Tom Hardy', 'English', 'https://www.youtube.com/watch?v=YoHD9XEInc0', false, NOW(), NOW()),
        ('The Shawshank Redemption', 'A story about friendship and hope', 142, '1994-09-23', 'def456', 'https://th.bing.com/th/id/OIP.o51YcsduW3TM0AjhSuwUAgHaEo?w=273&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7', 3, 'Frank Darabont', 'Tim Robbins, Morgan Freeman', 'English', 'https://www.youtube.com/watch?v=6hB3S9bIaco', false, NOW(), NOW()),
        ('Forrest Gump', 'A heartwarming story of a man with an IQ of 75', 142, '1994-07-06', 'ghi789', 'https://th.bing.com/th/id/OIP.o51YcsduW3TM0AjhSuwUAgHaEo?w=273&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7', 12, 'Robert Zemeckis', 'Tom Hanks, Robin Wright', 'English', 'https://www.youtube.com/watch?v=uPIEn0M8su0', false, NOW(), NOW()),
        ('The Dark Knight', 'A thrilling superhero movie', 152, '2008-07-18', 'jkl012', 'https://th.bing.com/th/id/OIP.o51YcsduW3TM0AjhSuwUAgHaEo?w=273&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7', 1, 'Christopher Nolan', 'Christian Bale, Heath Ledger', 'English', 'https://www.youtube.com/watch?v=EXeTwQWrcwY', false, NOW(), NOW()),
        ('Pulp Fiction', 'A non-linear crime film', 154, '1994-10-14', 'mno345', 'https://th.bing.com/th/id/OIP.o51YcsduW3TM0AjhSuwUAgHaEo?w=273&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7', 15, 'Quentin Tarantino', 'John Travolta, Samuel L. Jackson', 'English', 'https://www.youtube.com/watch?v=s7EdQ4FqbhY', false, NOW(), NOW())
        
    `;
  }

  async createRoom(): Promise<void> {
    await this.prisma.$executeRaw` INSERT INTO "Room" (
        "roomName", 
        "capacity",
        "createdAt",
        "updatedAt"
      ) VALUES
      ('Room 1', 50, NOW(), NOW()),
      ('Room 2', 50, NOW(), NOW()),
      ('Room 3', 50, NOW(), NOW()),
      ('Room 4', 50, NOW(), NOW()),
      ('Room 5', 50, NOW(), NOW()),
      ('Room 6', 50, NOW(), NOW()),
      ('Room 7', 50, NOW(), NOW()),
      ('Room 8', 50, NOW(), NOW()),
      ('Room 9', 50, NOW(), NOW()),
      ('Room 10', 50, NOW(), NOW()),
      ('Room 11', 50, NOW(), NOW()),
      ('Room 12', 50, NOW(), NOW()),
      ('Room 13', 50, NOW(), NOW()),
      ('Room 14', 50, NOW(), NOW()),
      ('Room 15', 50, NOW(), NOW()),
      ('Room 16', 50, NOW(), NOW()),
      ('Room 17', 50, NOW(), NOW()),
      ('Room 18', 50, NOW(), NOW()),
      ('Room 19', 50, NOW(), NOW()),
      ('Room 20', 50, NOW(), NOW())
      `;
  }

  async createSchedule(): Promise<void> {
    await this.prisma.$executeRaw` INSERT INTO public."Schedule" (
        "date",
        "timeStart",
        "timeEnd",
        "movieId",
        "roomId",
        "deleteAt",
        "createdAt",
        "updatedAt"
      ) VALUES
      ('2024-07-26 08:00:00', '2024-07-26 08:00:00', '2024-07-26 10:00:00', 1, 1, false, now(), now()),
      ('2024-07-26 10:00:00', '2024-07-26 10:00:00', '2024-07-26 12:00:00', 1, 1, false, now(), now()),
      ('2024-07-26 12:00:00', '2024-07-26 12:00:00', '2024-07-26 14:00:00', 1, 1, false, now(), now()),
      ('2024-07-26 14:00:00', '2024-07-26 14:00:00', '2024-07-26 16:00:00', 1, 1, false, now(), now()),
      ('2024-07-26 16:00:00', '2024-07-26 16:00:00', '2024-07-26 18:00:00', 1, 1, false, now(), now()),
      ('2024-07-27 08:00:00', '2024-07-27 08:00:00', '2024-07-27 10:00:00', 1, 1, false, now(), now()),
      ('2024-07-27 10:00:00', '2024-07-27 10:00:00', '2024-07-27 12:00:00', 1, 1, false, now(), now()),
      ('2024-07-27 12:00:00', '2024-07-27 12:00:00', '2024-07-27 14:00:00', 1, 1, false, now(), now()),
      ('2024-07-27 14:00:00', '2024-07-27 14:00:00', '2024-07-27 16:00:00', 1, 1, false, now(), now()),
      ('2024-07-27 16:00:00', '2024-07-27 16:00:00', '2024-07-27 18:00:00', 1, 1, false, now(), now()),
      ('2024-07-28 08:00:00', '2024-07-28 08:00:00', '2024-07-28 10:00:00', 1, 1, false, now(), now()),
      ('2024-07-28 10:00:00', '2024-07-28 10:00:00', '2024-07-28 12:00:00', 1, 1, false, now(), now()),
      ('2024-07-28 12:00:00', '2024-07-28 12:00:00', '2024-07-28 14:00:00', 1, 1, false, now(), now()),
      ('2024-07-28 14:00:00', '2024-07-28 14:00:00', '2024-07-28 16:00:00', 1, 1, false, now(), now()),
      ('2024-07-28 16:00:00', '2024-07-28 16:00:00', '2024-07-28 18:00:00', 1, 1, false, now(), now()),
      ('2024-07-29 08:00:00', '2024-07-29 08:00:00', '2024-07-29 10:00:00', 1, 1, false, now(), now()),
      ('2024-07-29 10:00:00', '2024-07-29 10:00:00', '2024-07-29 12:00:00', 1, 1, false, now(), now()),
      ('2024-07-29 12:00:00', '2024-07-29 12:00:00', '2024-07-29 14:00:00', 1, 1, false, now(), now()),
      ('2024-07-29 14:00:00', '2024-07-29 14:00:00', '2024-07-29 16:00:00', 1, 1, false, now(), now()),
      ('2024-07-29 16:00:00', '2024-07-29 16:00:00', '2024-07-29 18:00:00', 1, 1, false, now(), now()),
      ('2024-07-30 08:00:00', '2024-07-30 08:00:00', '2024-07-30 10:00:00', 1, 1, false, now(), now()),
      ('2024-07-30 10:00:00', '2024-07-30 10:00:00', '2024-07-30 12:00:00', 1, 1, false, now(), now()),
      ('2024-07-30 12:00:00', '2024-07-30 12:00:00', '2024-07-30 14:00:00', 1, 1, false, now(), now()),
      ('2024-07-30 14:00:00', '2024-07-30 14:00:00', '2024-07-30 16:00:00', 1, 1, false, now(), now()),
      ('2024-07-30 16:00:00', '2024-07-30 16:00:00', '2024-07-30 18:00:00', 1, 1, false, now(), now()),
      ('2024-07-31 08:00:00', '2024-07-31 08:00:00', '2024-07-31 10:00:00', 1, 1, false, now(), now()),
      ('2024-07-31 10:00:00', '2024-07-31 10:00:00', '2024-07-31 12:00:00', 1, 1, false, now(), now()),
      ('2024-07-31 12:00:00', '2024-07-31 12:00:00', '2024-07-31 14:00:00', 1, 1, false, now(), now()),
      ('2024-07-31 14:00:00', '2024-07-31 14:00:00', '2024-07-31 16:00:00', 1, 1, false, now(), now()),
      ('2024-07-31 16:00:00', '2024-07-31 16:00:00', '2024-07-31 18:00:00', 1, 1, false, now(), now()),
      ('2024-08-01 08:00:00', '2024-08-01 08:00:00', '2024-08-01 10:00:00', 1, 1, false, now(), now()),
      ('2024-08-01 10:00:00', '2024-08-01 10:00:00', '2024-08-01 12:00:00', 1, 1, false, now(), now()),
      ('2024-08-01 12:00:00', '2024-08-01 12:00:00', '2024-08-01 14:00:00', 1, 1, false, now(), now()),
      ('2024-08-01 14:00:00', '2024-08-01 14:00:00', '2024-08-01 16:00:00', 1, 1, false, now(), now()),
      ('2024-08-01 16:00:00', '2024-08-01 16:00:00', '2024-08-01 18:00:00', 1, 1, false, now(), now())
      `;
  }

  async createSeatType(): Promise<void> {
    await this.prisma.$executeRaw`
        INSERT INTO public."SeatType" (name, price)
        VALUES
        ('Standard', 100000),
        ('VIP', 200000)
      `;
  }

  async createSeat(): Promise<void> {
    await this.prisma.$executeRaw`
        INSERT INTO "Seat" ("name", "seatTypeId")
        VALUES
          ('A1', 1), ('A2', 1), ('A3', 1), ('A4', 1), ('A5', 1),
          ('A6', 1), ('A7', 1), ('A8', 1), ('A9', 1), ('A10', 1),
          ('B1', 1), ('B2', 1), ('B3', 1), ('B4', 1), ('B5', 1),
          ('B6', 1), ('B7', 1), ('B8', 1), ('B9', 1), ('B10', 1),
          ('C1', 1), ('C2', 1), ('C3', 1), ('C4', 1), ('C5', 1),
          ('C6', 1), ('C7', 1), ('C8', 1), ('C9', 1), ('C10', 1),
          ('D1', 2), ('D2', 2), ('D3', 2), ('D4', 2), ('D5', 2),
          ('D6', 2), ('D7', 2), ('D8', 2), ('D9', 2), ('D10', 2),
          ('E1', 2), ('E2', 2), ('E3', 2), ('E4', 2), ('E5', 2),
          ('E6', 2), ('E7', 2), ('E8', 2), ('E9', 2), ('E10', 2)
          `;
  }

  async createRoomSeat(): Promise<void> {
    await this.prisma.$executeRaw`
      INSERT INTO public."RoomState" ("scheduleId", "roomId", "availableSeat", "unavailableSeat", "createdAt","updatedAt")
      VALUES
        (1, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (2, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (3, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (4, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (5, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (6, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (7, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (8, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (9, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (10, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (11, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (12, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (13, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (14, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (15, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (16, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (17, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (18, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (19, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (20, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (21, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (22, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (23, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (24, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (25, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (26, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (27, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (28, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (29, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (30, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (31, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (32, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (33, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (34, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now()),
        (35, 1, ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], '{}',now(),now())
            `;
  }
}
