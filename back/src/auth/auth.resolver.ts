import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { SignUpInputDto } from './dto/signupInput.dto';
import { SingResponseDto } from './dto/signResponse.dto';
import { SignInInputDto } from './dto/signinInput.dto';
import { LogoutResponseDto } from './dto/logoutResponse.dto';
import { Public } from './decorators/public.decorator';
import { NewTokensResponse } from './dto/newTokensResponse';
import { CurrentUserId } from './decorators/currentUserId.decorator';
import { CurrentUser } from './decorators/currentUser.decorator';
import { UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from './guards/refreshToken.guard';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SingResponseDto)
  signup(@Args('signUpInput') signUpInput: SignUpInputDto) {
    return this.authService.signup(signUpInput);
  }

  @Public()
  @Mutation(() => SingResponseDto)
  signin(@Args('signInInput') signInInput: SignInInputDto) {
    return this.authService.signIn(signInInput);
  }

  @Mutation(() => LogoutResponseDto)
  logout(@Args('id', { type: () => Int }) id: number) {
    return this.authService.logout(id);
  }

  @Query(() => String)
  hello() {
    return 'Hello';
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Mutation(() => NewTokensResponse)
  getNewTokens(
    @CurrentUserId() userId: number,
    @CurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.getNewTokens(userId, refreshToken);
  }
}
