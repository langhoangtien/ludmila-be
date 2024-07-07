import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { BaseServiceAbstract } from '../base/services/base.service.abstract';
import { OrdersRepositoryInterface } from './interfaces/order.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductVariantsService } from '../product-variants/product-variants.service';
import mongoose from 'mongoose';
import { CustomersService } from '../customers/customers.service';
import { NullableType } from '../utils/types/nullable.type';
import { getUniqueByProperty } from '../utils/common';

const SHIPPING_FEE = 30000;
const SHIPPING_FEE_THRESHOLD = 500000;
@Injectable()
export class OrdersService extends BaseServiceAbstract<Order> {
  constructor(
    @Inject('OrdersRepositoryInterface')
    private readonly orderRepository: OrdersRepositoryInterface,
    private readonly productVariantService: ProductVariantsService,
    private readonly customerService: CustomersService,
  ) {
    super(orderRepository);
  }
  async create(createDto: CreateOrderDto): Promise<any> {
    // KHông cần thiết
    const productVariantIds = getUniqueByProperty(
      createDto.products,
      'productVariantId',
    ).map(
      (productVariant) =>
        new mongoose.Types.ObjectId(productVariant.productVariantId),
    );

    const productsData = await this.productVariantService.aggregate([
      {
        $match: {
          _id: { $in: productVariantIds },
          deletedAt: null,
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $unwind: '$product',
      },
      {
        $project: {
          _id: 1,
          salePrice: 1,
          price: 1,
          name: '$product.name',
          productImage: '$product.image',
        },
      },
    ]);

    if (productsData.length !== createDto.products.length)
      throw new BadRequestException();
    let subTotal = 0;
    const products = productsData.map((product) => {
      const quantity = createDto.products.find(
        (i) => i.productVariantId === product._id.toString(),
      )?.quantity;
      if (!quantity) throw new BadRequestException();
      subTotal += quantity * product.salePrice;
      return {
        name: product.name,
        image: product.image || product.productImage || undefined,
        quantity,
        price: product.salePrice,
        productVariantId: product._id.toString(),
      };
    });

    // await this.customerService.create({
    //   fullName: createDto.receiverName,
    //   phoneNumber: createDto.phoneNumber,
    // });
    const shippingFee = subTotal >= SHIPPING_FEE_THRESHOLD ? 0 : SHIPPING_FEE;
    const totalPrice = subTotal + shippingFee;
    const clonePayload = {
      ...createDto,
      products,
      totalPrice,
      status: 'new',
      shippingFee,
      subTotal,
    };
    return this.orderRepository.create(clonePayload);
  }

  async findMyOrders(query: any): Promise<any> {
    return this.orderRepository.find({
      ...query,
      filter: { ...query.filter, deletedAt: null },
    });
  }

  async update(
    id: string,
    updateDto: Partial<Order> | any,
  ): Promise<NullableType<Order>> {
    const order = await this.orderRepository.findById(id);
    if (order?.status === 'new')
      return await this.orderRepository.update(id, updateDto);
    throw new BadRequestException();
  }
}
