//  SDLVehicleDataNotificationStatus.m
//  SmartDeviceLink
//  Copyright (c) 2013 Ford Motor Company

#import <SmartDeviceLink/SDLVehicleDataNotificationStatus.h>   

SDLVehicleDataNotificationStatus* SDLVehicleDataNotificationStatus_NOT_SUPPORTED = nil;
SDLVehicleDataNotificationStatus* SDLVehicleDataNotificationStatus_NORMAL = nil;
SDLVehicleDataNotificationStatus* SDLVehicleDataNotificationStatus_ACTIVE = nil;

NSMutableArray* SDLVehicleDataNotificationStatus_values = nil; 

@implementation SDLVehicleDataNotificationStatus

+(SDLVehicleDataNotificationStatus*) valueOf:(NSString*) value {                       
	for (SDLVehicleDataNotificationStatus* item in SDLVehicleDataNotificationStatus.values) {    
		if ([item.value isEqualToString:value]) { 
			return item; 
		} 
	} 
	return nil; 
}

+(NSMutableArray *) values {           
	if (SDLVehicleDataNotificationStatus_values == nil) {                               
		SDLVehicleDataNotificationStatus_values = [[NSMutableArray alloc] initWithObjects: 
                                    SDLVehicleDataNotificationStatus.NOT_SUPPORTED,
                                    SDLVehicleDataNotificationStatus.NORMAL,
                                    SDLVehicleDataNotificationStatus.ACTIVE,
									nil];                        
	} 
	return SDLVehicleDataNotificationStatus_values; 
}

+(SDLVehicleDataNotificationStatus*) NOT_SUPPORTED {
	if (SDLVehicleDataNotificationStatus_NOT_SUPPORTED == nil) {
		SDLVehicleDataNotificationStatus_NOT_SUPPORTED = [[SDLVehicleDataNotificationStatus alloc] initWithValue:@"NOT_SUPPORTED"];
	} 
	return SDLVehicleDataNotificationStatus_NOT_SUPPORTED;  
}

+(SDLVehicleDataNotificationStatus*) NORMAL {
	if (SDLVehicleDataNotificationStatus_NORMAL == nil) {
		SDLVehicleDataNotificationStatus_NORMAL = [[SDLVehicleDataNotificationStatus alloc] initWithValue:@"NORMAL"];
	}
	return SDLVehicleDataNotificationStatus_NORMAL;
}

+(SDLVehicleDataNotificationStatus*) ACTIVE {
	if (SDLVehicleDataNotificationStatus_ACTIVE == nil) {
		SDLVehicleDataNotificationStatus_ACTIVE = [[SDLVehicleDataNotificationStatus alloc] initWithValue:@"ACTIVE"];
	}
	return SDLVehicleDataNotificationStatus_ACTIVE;
}

@end


