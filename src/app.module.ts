import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './database/config/database.config';
import authConfig from './auth/config/auth.config';
import appConfig from './config/app.config';
import mailConfig from './mail/config/mail.config';
import fileConfig from './files/config/file.config';
import facebookConfig from './auth-facebook/config/facebook.config';
import googleConfig from './auth-google/config/google.config';
import path from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthFacebookModule } from './auth-facebook/auth-facebook.module';
import { AuthGoogleModule } from './auth-google/auth-google.module';
import { I18nModule } from 'nestjs-i18n/dist/i18n.module';
import { HeaderResolver } from 'nestjs-i18n';
import { MailModule } from './mail/mail.module';
import { HomeModule } from './home/home.module';
import { AllConfigType } from './config/config.type';
import { SessionModule } from './session/session.module';
import { MailerModule } from './mailer/mailer.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './database/mongoose-config.service';
import { ProductsModule } from './products/products.module';
import { CountriesModule } from './countries/countries.module';
import { CategoriesModule } from './categories/categories.module';
import { VendorsModule } from './vendors/vendors.module';
import { ProductVariantsModule } from './product-variants/product-variants.module';
import { CustomersModule } from './customers/customers.module';
import { OrdersModule } from './orders/orders.module';
import { BrandsModule } from './brands/brands.module';
import { CommentsModule } from './comments/comments.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './exception-filters/global-exception.filter';
import { OptionsModule } from './options/options.module';
import { PagesModule } from './pages/pages.module';

const infrastructureDatabaseModule = MongooseModule.forRootAsync({
  useClass: MongooseConfigService,
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        authConfig,
        appConfig,
        mailConfig,
        fileConfig,
        facebookConfig,
        googleConfig,
      ],
      envFilePath: ['.env'],
    }),
    infrastructureDatabaseModule,
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
          infer: true,
        }),
        loaderOptions: { path: path.join(__dirname, '/i18n/'), watch: true },
      }),
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService<AllConfigType>) => {
            return [
              configService.get('app.headerLanguage', {
                infer: true,
              }),
            ];
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    UsersModule,
    FilesModule,
    AuthModule,
    AuthFacebookModule,
    AuthGoogleModule,
    SessionModule,
    MailModule,
    MailerModule,
    HomeModule,
    ProductsModule,
    CountriesModule,
    CategoriesModule,
    VendorsModule,
    ProductVariantsModule,
    CustomersModule,
    OrdersModule,
    BrandsModule,
    CommentsModule,
    OptionsModule,
    PagesModule,
    // ServeStaticModule.forRoot({
    //   rootPath: path.join(__dirname, '..', 'files'),
    //   serveStaticOptions: { index: false },
    //   serveRoot: '/api/v1/files/',
    // }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
