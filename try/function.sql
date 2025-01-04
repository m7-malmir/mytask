USE [Bpms_Product]
GO
/****** Object:  UserDefinedFunction [dbo].[ufn_ShomareBeHarf]    Script Date: 1/4/2025 11:07:05 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER FUNCTION [dbo].[ufn_ShomareBeHarf]
(
	-- Add the parameters for the function here
	@PARAM_ VARCHAR(2)
)
RETURNS NVARCHAR(5)
AS
BEGIN
	-- Declare the return variable here
	DECLARE @res nvarchar(5)

	-- Add the T-SQL statements to compute the return value here
	--SELECT 
	
SET @res = CASE @PARAM_
when '01' then N'ء'    
when '02' then N'ا'    
when '03' then N'ب'    
when '04' then N'پ'    
when '05' then N'ت'    
when '06' then N'ث'    
when '07' then N'ج'    
when '08' then N'چ'    
when '09' then N'ح'    
when '10' then N'خ'    
when '11' then N'د'    
when '12' then N'ذ'    
when '13' then N'ر'    
when '14' then N'ز'    
when '15' then N'ژ'    
when '16' then N'س'    
when '17' then N'ش'    
when '18' then N'ص'    
when '19' then N'ض'    
when '20' then N'ط'    
when '21' then N'ظ'    
when '22' then N'ع'    
when '23' then N'غ'    
when '24' then N'ف'    
when '25' then N'ق'    
when '26' then N'ک'    
when '27' then N'گ'    
when '28' then N'ل'    
when '29' then N'م'    
when '30' then N'ن'    
when '31' then N'و'    
when '32' then N'ه'    
when '33' then N'ی'
ELSE ''
END

	-- Return the result of the function
	RETURN @res

END
