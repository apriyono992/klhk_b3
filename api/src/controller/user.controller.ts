import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    Query,
    UploadedFiles,
    UseInterceptors,
    UseGuards,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
  import { SearchUsersDto } from 'src/models/searchUsersDto';
  import { CreateUserDTO } from 'src/models/createUserDto';
  import { FilesInterceptor } from '@nestjs/platform-express';
import { UserService } from 'src/services/users.services';
import { JwtAuthGuard } from 'src/utils/auth.guard';
import { RolesGuard } from 'src/utils/roles.guard';
import { RoleCompanyGuard } from 'src/utils/roleCompany.guard';
  
  @ApiTags('Users')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Controller('users')
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    @Get("search-users")
    @ApiOperation({ summary: 'Mencari daftar pengguna dengan filter dan pagination' })
    @ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Nomor halaman untuk pagination',
    })
    @ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Jumlah data per halaman',
    })
    @ApiQuery({
      name: 'nama',
      required: false,
      type: String,
      description: 'Filter berdasarkan nama pengguna',
    })
    @ApiQuery({
      name: 'companyIds',
      required: false,
      type: [String],
      description: 'Filter berdasarkan ID perusahaan (array)',
    })
    @UseGuards(RoleCompanyGuard) // Tambahkan validasi akses ke perusahaan
    async getUsers(@Query() dto: SearchUsersDto) {
      return this.userService.getUsers(dto);
    }
  
    @Post()
    @ApiOperation({ summary: 'Membuat pengguna baru' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      description: 'Data untuk membuat pengguna baru',
      schema: {
        type: 'object',
        properties: {
          email: { type: 'string', example: 'john.doe@example.com' },
          phoneNumber: { type: 'string', example: '081234567890' },
          fullName: { type: 'string', example: 'John Doe' },
          password: { type: 'string', example: 'securepassword' },
          address: { type: 'string', example: 'Jl. Contoh' },
          provinceId: { type: 'string', example: 'prov-123' },
          cityId: { type: 'string', example: 'city-456' },
          rolesIds: {
            type: 'array',
            items: { type: 'string' },
            example: ['role-id-1', 'role-id-2'],
          },
          companyIds: {
            type: 'array',
            items: { type: 'string' },
            example: ['comp-123', 'comp-456'],
          },
          idNumber: { type: 'string', example: '1234567890123456' },
          attachments: {
            type: 'string',
            format: 'binary',
            description: 'File KTP pengguna',
          },
        },
      },
    })
    @UseInterceptors(FilesInterceptor('attachments'))
    async createUser(
      @Body() payload: CreateUserDTO,
      @UploadedFiles() attachments: Express.Multer.File[],
    ) {
      return this.userService.createUser(payload, attachments);
    }
  
    @Put('update-user/:id')
    @ApiOperation({ summary: 'Memperbarui pengguna yang ada' })
    @ApiConsumes('multipart/form-data')
    @ApiParam({
      name: 'id',
      description: 'ID pengguna yang akan diperbarui',
      example: 'user-id-1',
    })
    @ApiBody({
      description: 'Data untuk memperbarui pengguna',
      schema: {
        type: 'object',
        properties: {
          email: { type: 'string', example: 'john.doe@example.com' },
          phoneNumber: { type: 'string', example: '081234567890' },
          fullName: { type: 'string', example: 'John Doe' },
          address: { type: 'string', example: 'Jl. Contoh Baru' },
          provinceId: { type: 'string', example: 'prov-123' },
          cityId: { type: 'string', example: 'city-456' },
          rolesIds: {
            type: 'array',
            items: { type: 'string' },
            example: ['role-id-1'],
          },
          companyIds: {
            type: 'array',
            items: { type: 'string' },
            example: ['comp-123'],
          },
          attachments: {
            type: 'string',
            format: 'binary',
            description: 'File KTP pengguna',
          },
        },
      },
    })
    @UseInterceptors(FilesInterceptor('attachments'))
    async updateUser(
      @Param('id') userId: string,
      @Body() payload: Partial<CreateUserDTO>,
      @UploadedFiles() attachments?: Express.Multer.File[],
    ) {
      return this.userService.updateUser(userId, payload, attachments);
    }

    @Get('find/:id')
    @ApiOperation({ summary: 'Mendapatkan detail pengguna berdasarkan ID' })
    @ApiParam({
    name: 'id',
    description: 'ID pengguna yang ingin diambil datanya',
    example: 'user-id-12345',
    })
    async getUserById(@Param('id') userId: string) {
    return this.userService.getUserById(userId);
    }
  }
  