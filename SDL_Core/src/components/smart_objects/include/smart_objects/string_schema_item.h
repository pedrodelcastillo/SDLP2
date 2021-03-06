/**
 * @file CStringSchemaItem.hpp
 * @brief CStringSchemaItem header file.
 */
// Copyright (c) 2013, Ford Motor Company
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this
// list of conditions and the following disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice,
// this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the
// distribution.
//
// Neither the name of the Ford Motor Company nor the names of its contributors
// may be used to endorse or promote products derived from this software
// without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR 'A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

#ifndef __SMARTOBJECT_CSTRINGSCHEMAITEM_HPP__
#define __SMARTOBJECT_CSTRINGSCHEMAITEM_HPP__

#include <stddef.h>
#include <string>

#include "utils/shared_ptr.h"

#include "smart_objects/schema_item.h"
#include "smart_objects/schema_item_parameter.h"

namespace NsSmartDeviceLink
{
    namespace NsSmartObjects
    {
        /**
         * @brief String schema item.
         **/
        class CStringSchemaItem: public ISchemaItem
        {
        public:
            /**
             * @brief Create a new schema item.
             *
             * @param MaxLength Maximum allowed string length.
             * @param DefaultValue Default value.
             *
             * @return Shared pointer to a new schema item.
             **/
            static utils::SharedPtr<CStringSchemaItem> create(const TSchemaItemParameter<size_t> & MinLength = TSchemaItemParameter<size_t>(),
                                                              const TSchemaItemParameter<size_t> & MaxLength = TSchemaItemParameter<size_t>(),
                                                              const TSchemaItemParameter<std::string> & DefaultValue = TSchemaItemParameter<std::string>());

            /**
             * @brief Validate smart object.
             *
             * @param Object Object to validate.
             *
             * @return NsSmartObjects::Errors::eType
             **/
            virtual Errors::eType validate(const NsSmartDeviceLink::NsSmartObjects::SmartObject & Object);

            /**
             * @brief Set default value to an object.
             *
             * @param Object Object to set default value.
             *
             * @return true if default value was successfully set, false otherwise.
             **/
            virtual bool setDefaultValue(SmartObject & Object);

            /**
             * @brief Build smart object by smart schema having copied matched
             *        parameters from pattern smart object
             *
             * @param pattern_object pattern object
             * @param result_object object to build
             */
            virtual void BuildObjectBySchema(
              const NsSmartDeviceLink::NsSmartObjects::SmartObject& pattern_object,
              NsSmartDeviceLink::NsSmartObjects::SmartObject& result_object);

        private:
            /**
             * @brief Constructor.
             *
             * @param MaxLength Maximum allowed string length.
             * @param DefaultValue Default value.
             **/
            CStringSchemaItem(const TSchemaItemParameter<size_t> & MinLength,
                              const TSchemaItemParameter<size_t> & MaxLength,
                              const TSchemaItemParameter<std::string> & DefaultValue);

            /**
             * @brief Copy constructor.
             *
             * Not implemented to prevent misuse.
             *
             * @param Other Other schema item.
             **/
            CStringSchemaItem(const CStringSchemaItem & Other);

            /**
             * @brief Assignment operator.
             *
             * Not implemented to prevent misuse.
             *
             * @param Other Other schema item.
             *
             * @return Not implemented.
             **/
            CStringSchemaItem & operator =(const CStringSchemaItem & Other);

            /**
             * @brief Minimum allowed string length.
             **/
            const TSchemaItemParameter<size_t> mMinLength;

            /**
             * @brief Maximum allowed string length.
             **/
            const TSchemaItemParameter<size_t> mMaxLength;

            /**
             * @brief Default value.
             **/
            const TSchemaItemParameter<std::string> mDefaultValue;
        };
    }
}

#endif
