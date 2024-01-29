import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
  ) {}

  // async create(createMovieDto: CreateMovieDto) {
  //   const title = createMovieDto.title;
  //   const existingMovie = await this.movieRepository.findOne({
  //     where: { title },
  //   });

  //   if (existingMovie) {
  //     throw new HttpException(
  //       'This movie already exists',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   const newMovie = this.movieRepository.create(createMovieDto);
  //   await this.movieRepository.save(newMovie);
  //   return newMovie;
  // }

  // async findAll(limit: number, page: number) {
  //   const findMovies = await this.movieRepository.find({
  //     take: limit,
  //     skip: page * limit,
  //   });

  //   const count = await this.movieRepository.count({});

  //   if (findMovies.length === 0) {
  //     return 'Your movie list is empty';
  //   }
  //   const totalPages = Math.ceil(count / limit);

  //   // Next page still has some issues condition working incorrectly
  //   const nextPage = page < totalPages ? page + 1 : null;

  //   return { movies: findMovies, count, current: page, next: nextPage };
  // }

  // async findOne(id: number) {
  //   const movie = await this.movieRepository.findOne({
  //     where: { id },
  //   });
  //   if (!movie) {
  //     throw new HttpException('No movie was found', HttpStatus.BAD_REQUEST);
  //   }
  //   return movie;
  // }

  // async update(id: number, updateMovieDto: UpdateMovieDto) {
  //   const movie = await this.findOne(id);
  //   return this.movieRepository.save({ ...movie, ...updateMovieDto });
  // }

  // async remove(id: number) {
  //   const movie = await this.findOne(id);
  //   movie.deletedAt = new Date();
  //   movie.isActive = false;
  //   await this.movieRepository.save(movie);
  //   return 'Movie deleted successfully!';
  // }
}
