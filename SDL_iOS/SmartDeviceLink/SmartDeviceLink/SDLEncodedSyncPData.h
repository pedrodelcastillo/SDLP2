//  SDLEncodedSyncPData.h
//  SmartDeviceLink
//  Copyright (c) 2013 Ford Motor Company

#import <Foundation/Foundation.h>
#import <SmartDeviceLink/SDLRPCRequest.h>

@interface SDLEncodedSyncPData: SDLRPCRequest {}

-(id) init;
-(id) initWithDictionary:(NSMutableDictionary*) dict;

@property(assign) NSMutableArray* data;

@end