import { HttpModule, HttpService } from '@nestjs/axios';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PokemonService } from './pokemon.service';
import { DeepMocked, createMock } from '@golevelup/ts-jest';

describe('PokemonService', () => {
  let pokemonService: PokemonService;
  let httpService: DeepMocked<HttpService>;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
      ],
    }).useMocker(createMock).compile();

    pokemonService = module.get<PokemonService>(PokemonService);
    httpService = module.get(HttpService);
  });


  it('should be defined', () => {
    expect(pokemonService).toBeDefined();
  });


  it('valid pokemon ID to return the pokemon name', async () => {
    httpService.axiosRef.mockResolvedValueOnce({
      data: {
        species: { name: `bulbasaur` },
      },
      headers: {},
      config: { url: '' },
      status: 200,
      statusText: '',
    });

    const getPokemon = pokemonService.getPokemon(1);

    await expect(getPokemon).resolves.toBe('bulbasaur');
  });
  

  it('if Pokemon API response unexpectedly changes, throw an error', async () => {
    httpService.axiosRef.mockResolvedValueOnce({
      data: `Unexpected data`,
      headers: {},
      config: { url: '' },
      status: 200,
      statusText: '',
    });

    const getPokemon = pokemonService.getPokemon(1);

    await expect(getPokemon).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
  });

  

});

